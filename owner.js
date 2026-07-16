const STORAGE_KEY = "stream-donation-platform-v2";
const goal = 4000000;
const apiPath = "/api/donations";

const elements = {
  totalRaised: document.getElementById("totalRaised"),
  supporterCount: document.getElementById("supporterCount"),
  goalLabel: document.getElementById("goalLabel"),
  progressFill: document.getElementById("progressFill"),
  goalPercent: document.getElementById("goalPercent"),
  remainingGoal: document.getElementById("remainingGoal"),
  topDonation: document.getElementById("topDonation"),
  donationFeed: document.getElementById("donationFeed"),
  copyOverlayUrl: document.getElementById("copyOverlayUrl"),
  overlayLink: document.getElementById("overlayLink"),
  bankStatus: document.getElementById("bankStatus"),
  availableBalance: document.getElementById("availableBalance"),
  bankMethod: document.getElementById("bankMethod"),
  bankSelect: document.getElementById("bankSelect"),
  accountInput: document.getElementById("accountInput"),
  accountNameInput: document.getElementById("accountNameInput"),
  withdrawTarget: document.getElementById("withdrawTarget"),
  saveBankButton: document.getElementById("saveBankButton"),
  withdrawButton: document.getElementById("withdrawButton"),
  withdrawalHistory: document.getElementById("withdrawalHistory"),
  toast: document.getElementById("toast")
};

const BANK_KEY = "stream-donation-bank";
const WITHDRAW_KEY = "stream-donation-withdrawals";
let currentTotal = 0;

function getBankSettings() {
  const stored = localStorage.getItem(BANK_KEY);
  if (!stored) {
    return {
      method: "DANA",
      account: "081211204547",
      owner: "Nama Rekening",
      verified: false
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      method: "DANA",
      account: "081211204547",
      owner: "Nama Rekening",
      verified: false
    };
  }
}

function saveBankSettings(settings) {
  localStorage.setItem(BANK_KEY, JSON.stringify(settings));
}

function getWithdrawalHistory() {
  const stored = localStorage.getItem(WITHDRAW_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveWithdrawalHistory(history) {
  localStorage.setItem(WITHDRAW_KEY, JSON.stringify(history));
}

function getPendingWithdrawalAmount(history) {
  return history
    .filter((item) => item.status !== "Dibatalkan")
    .reduce((sum, item) => sum + item.amount, 0);
}

function renderBankSettings(settings, total) {
  const history = getWithdrawalHistory();
  const pending = getPendingWithdrawalAmount(history);
  const withdrawable = Math.max(total - pending, 0);

  elements.bankMethod.textContent = settings.method;
  elements.bankStatus.textContent = settings.verified ? "Rekening terverifikasi" : "Rekening belum diverifikasi";
  elements.availableBalance.textContent = formatRupiah(withdrawable);
  elements.withdrawTarget.textContent = `${settings.method} • ${settings.account}`;
  elements.bankSelect.value = settings.method;
  elements.accountInput.value = settings.account;
  elements.accountNameInput.value = settings.owner;
  elements.withdrawButton.disabled = withdrawable <= 0;
}

function renderWithdrawalHistory() {
  const history = getWithdrawalHistory();
  if (!history.length) {
    elements.withdrawalHistory.innerHTML = '<li class="withdraw-item empty">Belum ada permintaan penarikan.</li>';
    return;
  }

  elements.withdrawalHistory.innerHTML = history
    .slice()
    .sort((a, b) => b.requestedAt - a.requestedAt)
    .map((item, index) => {
      const date = new Date(item.requestedAt).toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      return `
        <li class="withdraw-item">
          <div class="withdraw-row">
            <strong>${formatRupiah(item.amount)}</strong>
            <span class="withdraw-status ${item.status.toLowerCase()}">${item.status}</span>
          </div>
          <div class="withdraw-info">${item.method} • ${item.account} • ${item.owner}</div>
          <div class="withdraw-date">${date}</div>
          ${item.status === "Menunggu" ? `
            <div class="withdraw-actions">
              <button class="btn btn-secondary btn-small withdraw-action" data-index="${index}" data-action="Berhasil">Berhasil</button>
              <button class="btn btn-secondary btn-small withdraw-action" data-index="${index}" data-action="Dibatalkan">Batalkan</button>
            </div>
          ` : ""}
        </li>
      `;
    })
    .join("");
}

function renderIncomeBreakdown(donations) {
  const breakdown = donations.reduce((acc, item) => {
    acc[item.method] = (acc[item.method] || 0) + item.amount;
    return acc;
  }, {});

  const methods = ["QRIS", "E-Wallet", "Transfer Bank", "DANA", "OVO", "GoPay", "BCA", "BRI", "Bank Seabank"];
  const container = document.getElementById("incomeBreakdown");
  container.innerHTML = methods
    .map((method) => {
      const amount = breakdown[method] || 0;
      return `
        <div class="income-card">
          <span class="label">${method}</span>
          <strong>${formatRupiah(amount)}</strong>
        </div>
      `;
    })
    .join("");
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2800);
}

function getLocalDonations() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveLocalDonations(donations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
}

async function fetchDonations() {
  if (window.location.protocol === "file:") {
    return getLocalDonations();
  }

  try {
    const response = await fetch(apiPath);
    if (!response.ok) throw new Error("Fetch error");
    return response.json();
  } catch (error) {
    return getLocalDonations();
  }
}

function renderDonations(donations) {
  const total = donations.reduce((sum, item) => sum + item.amount, 0);
  const progress = Math.min((total / goal) * 100, 100);

  currentTotal = total;
  elements.totalRaised.textContent = formatRupiah(total);
  elements.supporterCount.textContent = donations.length;
  elements.goalLabel.textContent = formatRupiah(goal);
  elements.progressFill.style.width = `${progress}%`;
  elements.goalPercent.textContent = `${Math.round(progress)}%`;
  elements.remainingGoal.textContent = Math.max(goal - total, 0).toLocaleString("id-ID");

  const top = donations.reduce((max, item) => (item.amount > max ? item.amount : max), 0);
  elements.topDonation.textContent = `Donasi terbesar: ${formatRupiah(top)}`;

  const bankSettings = getBankSettings();
  renderBankSettings(bankSettings, total);
  renderIncomeBreakdown(donations);

  elements.donationFeed.innerHTML = "";
  donations
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((item) => {
      const li = document.createElement("li");
      const time = new Date(item.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      li.innerHTML = `
        <div class="feed-top">
          <span class="feed-name">${item.name}</span>
          <span class="feed-amount">${formatRupiah(item.amount)}</span>
        </div>
        <div class="feed-message">${item.message || "Terima kasih atas donasinya!"}</div>
        <div class="feed-time">${item.method} • ${time}</div>
      `;
      elements.donationFeed.appendChild(li);
    });
}

async function updateOverlayUrl() {
  const origin = window.location.origin === "null" ? "http://localhost:3000" : window.location.origin;
  const defaultUrl = `${origin}/donor.html`;
  elements.overlayLink.textContent = defaultUrl;

  try {
    const response = await fetch("/api/info");
    if (!response.ok) return;
    const info = await response.json();
    if (info.addresses && info.addresses.length) {
      elements.overlayLink.innerHTML = info.addresses
        .map((addr) => `<div>http://${addr}:3000/donor.html</div>`)
        .join("");
    }
  } catch (error) {
    // ignore, keep localhost link available
  }
}

elements.copyOverlayUrl.addEventListener("click", async () => {
  const text = elements.overlayLink.textContent;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Link donor berhasil disalin.");
  } catch (error) {
    showToast("Gagal salin link, coba manual.");
  }
});

elements.saveBankButton.addEventListener("click", () => {
  const settings = {
    method: elements.bankSelect.value,
    account: elements.accountInput.value.trim() || "Belum diisi",
    owner: elements.accountNameInput.value.trim() || "Belum diisi",
    verified: true
  };
  saveBankSettings(settings);
  renderBankSettings(settings, currentTotal);
  renderWithdrawalHistory();
  showToast("Rekening berhasil disimpan.");
});

elements.withdrawButton.addEventListener("click", () => {
  const settings = getBankSettings();
  const history = getWithdrawalHistory();
  const pending = getPendingWithdrawalAmount(history);
  const withdrawable = Math.max(currentTotal - pending, 0);

  if (withdrawable <= 0) {
    showToast("Saldo tidak cukup untuk ditarik.");
    return;
  }

  if (!elements.accountInput.value.trim() || !elements.accountNameInput.value.trim()) {
    showToast("Isi nomor rekening dan nama pemilik rekening terlebih dahulu.");
    return;
  }

  const withdrawal = {
    amount: withdrawable,
    method: elements.bankSelect.value,
    account: elements.accountInput.value.trim(),
    owner: elements.accountNameInput.value.trim(),
    status: "Menunggu",
    requestedAt: Date.now()
  };

  history.push(withdrawal);
  saveWithdrawalHistory(history);
  renderBankSettings(settings, currentTotal);
  renderWithdrawalHistory();
  showToast(`Permintaan penarikan ${formatRupiah(withdrawable)} ke ${withdrawal.method} berhasil dibuat.`);
});

elements.withdrawalHistory.addEventListener("click", (event) => {
  const button = event.target.closest(".withdraw-action");
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;
  const history = getWithdrawalHistory();

  if (!history[index]) return;

  history[index].status = action;
  saveWithdrawalHistory(history);
  renderWithdrawalHistory();
  renderBankSettings(getBankSettings(), currentTotal);
  showToast(`Status penarikan diubah menjadi ${action}.`);
});

async function refresh() {
  const donations = await fetchDonations();
  renderDonations(donations);
}

window.addEventListener("load", () => {
  updateOverlayUrl();
  const userBank = getBankSettings();
  renderBankSettings(userBank, currentTotal);
  renderWithdrawalHistory();
  refresh();
  setInterval(refresh, 3000);
});

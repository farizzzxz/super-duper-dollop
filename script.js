const STORAGE_KEY = "stream-donation-demo-v1";
const goal = 4000000;
const defaultDonations = [
  { id: 1, name: "Alya", amount: 50000, message: "Semangat!", method: "QRIS", createdAt: Date.now() - 1000 * 60 * 12 },
  { id: 2, name: "Rafi", amount: 25000, message: "Lanjutkan!", method: "E-Wallet", createdAt: Date.now() - 1000 * 60 * 5 },
  { id: 3, name: "Nina", amount: 100000, message: "Streamingnya keren banget!", method: "Transfer Bank", createdAt: Date.now() - 1000 * 60 * 2 }
];

const state = {
  donations: JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || defaultDonations,
  live: true
};

const elements = {
  totalRaised: document.getElementById("totalRaised"),
  supporterCount: document.getElementById("supporterCount"),
  viewerCount: document.getElementById("viewerCount"),
  goalLabel: document.getElementById("goalLabel"),
  progressFill: document.getElementById("progressFill"),
  goalPercent: document.getElementById("goalPercent"),
  remainingGoal: document.getElementById("remainingGoal"),
  donationFeed: document.getElementById("donationFeed"),
  donationForm: document.getElementById("donationForm"),
  liveBadge: document.getElementById("liveBadge"),
  toggleLive: document.getElementById("toggleLive"),
  quickCheer: document.getElementById("quickCheer"),
  celebrateArea: document.getElementById("celebrateArea"),
  hero: document.querySelector(".hero"),
  paymentModal: document.getElementById("paymentModal"),
  closeModal: document.getElementById("closeModal"),
  confirmDonation: document.getElementById("confirmDonation"),
  paymentSummary: document.getElementById("paymentSummary"),
  modalAmount: document.getElementById("modalAmount"),
  modalMessage: document.getElementById("modalMessage"),
  toast: document.getElementById("toast"),
  copyUrl: document.getElementById("copyUrl"),
  obsUrl: document.getElementById("obsUrl"),
  openSupport: document.getElementById("openSupport")
};

let pendingDonation = null;

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.donations));
}

function getTotalRaised() {
  return state.donations.reduce((sum, item) => sum + item.amount, 0);
}

function render() {
  const total = getTotalRaised();
  const progress = Math.min((total / goal) * 100, 100);

  elements.totalRaised.textContent = formatRupiah(total);
  elements.supporterCount.textContent = state.donations.length;
  elements.goalLabel.textContent = formatRupiah(goal);
  elements.progressFill.style.width = `${progress}%`;
  elements.goalPercent.textContent = `${Math.round(progress)}%`;
  elements.remainingGoal.textContent = Math.max(goal - total, 0).toLocaleString("id-ID");

  elements.donationFeed.innerHTML = "";
  state.donations
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((item) => {
      const li = document.createElement("li");
      const time = new Date(item.createdAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      });
      li.innerHTML = `
        <div class="feed-top">
          <span class="feed-name">${item.name}</span>
          <span class="feed-amount">${formatRupiah(item.amount)}</span>
        </div>
        <div class="feed-message">${item.message || "Dukungan keren!"}</div>
        <div class="feed-time">${item.method} • ${time}</div>
      `;
      elements.donationFeed.appendChild(li);
    });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2600);
}

async function copyObsUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("URL OBS berhasil disalin");
  } catch (error) {
    showToast("Salin URL gagal, coba manual");
  }
}

function confettiBurst() {
  const colors = ["#ff7a00", "#8b5cf6", "#22c55e", "#facc15"];
  for (let i = 0; i < 18; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = "0";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.15}s`;
    elements.celebrateArea.appendChild(piece);
    setTimeout(() => piece.remove(), 1400);
  }
}

function setLiveMode(isLive) {
  state.live = isLive;
  elements.liveBadge.textContent = isLive ? "● LIVE NOW" : "○ READY";
  elements.liveBadge.style.background = isLive ? "rgba(255, 122, 0, 0.16)" : "rgba(34, 197, 94, 0.16)";
  elements.liveBadge.style.color = isLive ? "#ffd39d" : "#c7f5d0";
  elements.hero.classList.toggle("is-live", isLive);
}

function addDonation({ name, amount, message, method }) {
  state.donations.unshift({
    id: Date.now(),
    name,
    amount: Number(amount),
    message,
    method,
    createdAt: Date.now()
  });
  saveState();
  render();
  confettiBurst();
}

function simulateDonation(name, amount, message, method) {
  addDonation({ name, amount, message, method });
}

function openPaymentModal({ name, amount, message, method }) {
  pendingDonation = { name, amount, message, method };
  elements.paymentSummary.textContent = `${name || "Anon"} akan mengirim dukungan ${formatRupiah(amount)} lewat ${method}.`;
  elements.modalAmount.textContent = formatRupiah(amount);
  elements.modalMessage.textContent = message || "Dukungan keren!";
  elements.paymentModal.classList.remove("hidden");
  elements.paymentModal.setAttribute("aria-hidden", "false");
}

function closePaymentModal() {
  pendingDonation = null;
  elements.paymentModal.classList.add("hidden");
  elements.paymentModal.setAttribute("aria-hidden", "true");
}

// Events

elements.donationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("nameInput").value.trim() || "Anon";
  const amount = Number(document.getElementById("amountInput").value);
  const message = document.getElementById("messageInput").value.trim() || "Dukungan keren!";
  const method = document.getElementById("methodInput").value;

  openPaymentModal({ name, amount, message, method });
});

elements.confirmDonation.addEventListener("click", () => {
  if (!pendingDonation) return;

  addDonation(pendingDonation);
  elements.donationForm.reset();
  closePaymentModal();
  showToast(`Donasi dari ${pendingDonation.name || "Anon"} berhasil masuk ke dashboard!`);
});

elements.closeModal.addEventListener("click", closePaymentModal);
elements.copyUrl.addEventListener("click", copyObsUrl);
elements.openSupport.addEventListener("click", () => {
  document.querySelector(".donation-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("nameInput")?.focus();
});
elements.paymentModal.addEventListener("click", (event) => {
  if (event.target === elements.paymentModal) {
    closePaymentModal();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePaymentModal();
  }
});

elements.toggleLive.addEventListener("click", () => {
  setLiveMode(!state.live);
});

elements.quickCheer.addEventListener("click", () => {
  simulateDonation("Penonton", 15000, "Semangat terus!", "QRIS");
});

setInterval(() => {
  const randomViewer = 1200 + Math.floor(Math.random() * 220);
  elements.viewerCount.textContent = randomViewer.toLocaleString("id-ID");
}, 2500);

setLiveMode(true);
render();

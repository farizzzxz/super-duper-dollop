const STORAGE_KEY = "stream-donation-platform-v2";
const apiPath = "/api/donations";

const elements = {
  donationForm: document.getElementById("donationForm"),
  nameInput: document.getElementById("nameInput"),
  amountInput: document.getElementById("amountInput"),
  messageInput: document.getElementById("messageInput"),
  methodInput: document.getElementById("methodInput"),
  toast: document.getElementById("toast")
};

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 3000);
}

function getLocalDonations() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveLocalDonations(donations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
}

async function postDonation(donation) {
  if (window.location.protocol === "file:") {
    const donations = getLocalDonations();
    donations.unshift(donation);
    saveLocalDonations(donations);
    return { success: true };
  }

  try {
    const response = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donation)
    });
    if (!response.ok) throw new Error("post failed");
    return response.json();
  } catch (error) {
    return { success: false };
  }
}

elements.donationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const donation = {
    name: elements.nameInput.value.trim() || "Anon",
    amount: Number(elements.amountInput.value),
    message: elements.messageInput.value.trim() || "Support dari penonton!",
    method: elements.methodInput.value,
    createdAt: Date.now()
  };

  const result = await postDonation(donation);
  if (result.success) {
    showToast(`Terima kasih! Donasi ${formatRupiah(donation.amount)} berhasil dikirim.`);
    elements.donationForm.reset();
  } else {
    showToast("Gagal mengirim donasi. Coba lagi atau gunakan halaman owner jika belum terpasang server.");
  }
});

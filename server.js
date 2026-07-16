const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");

const port = process.env.PORT || 3000;
const rootDir = path.resolve(__dirname);
const dataFile = path.join(rootDir, "donations.json");

function readDonations() {
  try {
    const content = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

function saveDonations(donations) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(donations, null, 2), "utf8");
  } catch (error) {
    console.error("Unable to save donations:", error);
  }
}

function getNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const info of interfaces[name]) {
      if (info.family === "IPv4" && !info.internal) {
        addresses.push(info.address);
      }
    }
  }

  return addresses;
}

const app = express();
app.use(express.json());
app.use(express.static(rootDir));

app.get("/api/info", (req, res) => {
  res.json({ hostname: os.hostname(), addresses: getNetworkAddresses() });
});

app.get("/api/donations", (req, res) => {
  res.json(readDonations());
});

app.post("/api/donations", (req, res) => {
  const donation = req.body;
  if (!donation || !donation.name || !donation.amount) {
    return res.status(400).json({ success: false, error: "Invalid donation payload" });
  }

  const donations = readDonations();
  donations.unshift({ ...donation, createdAt: donation.createdAt || Date.now() });
  saveDonations(donations);

  res.status(201).json({ success: true });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "owner.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

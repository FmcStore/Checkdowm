import { sendTelegram } from '../utils/sendTelegram.js';
import { getStatus, setStatus } from '../utils/statusStore.js';
import axios from 'axios';

export default async function handler(req, res) {
  const targetURL = "https://api.siputzx.my.id/api/currency/rates";
  const currentStatus = getStatus();

  try {
    await axios.get(targetURL, { timeout: 5000 });

    // Jika sebelumnya down → berarti sekarang up
    if (currentStatus.status === "down") {
      const downSince = new Date(currentStatus.downTime);
      const now = new Date();
      const duration = Math.floor((now - downSince) / 1000); // dalam detik

      const mins = Math.floor(duration / 60);
      const secs = duration % 60;

      await sendTelegram(`✅ Website ${targetURL} sudah UP kembali setelah DOWN selama ${mins}m ${secs}s`);
      setStatus("up");
    }

    res.status(200).json({ status: "UP" });
  } catch (err) {
    if (currentStatus.status === "up") {
      const now = new Date().toISOString();
      await sendTelegram(`❌ Website ${targetURL} sedang DOWN! Mencatat waktu mulai...`);
      setStatus("down", now);
    }

    res.status(200).json({ status: "DOWN", error: err.message });
  }
}

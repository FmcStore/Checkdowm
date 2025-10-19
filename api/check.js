// api/check.js
import { sendTelegram } from '../utils/sendTelegram.js';
import { getStatus, setStatus } from '../utils/statusStore.js';
import axios from 'axios';

export default async function handler(req, res) {
  const targetURL = "https://gdnstore.my.id";
  const currentStatus = getStatus();

  const now = new Date();
  const timestamp = now.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'long',
  });

  try {
    const response = await axios.get(targetURL, { timeout: 5000 });

    if (currentStatus.status === "down") {
      // Saat kembali UP, hitung durasi downtime
      const downSince = new Date(currentStatus.downTime);
      const durationSeconds = Math.floor((now - downSince) / 1000);
      const mins = Math.floor(durationSeconds / 60);
      const secs = durationSeconds % 60;
      const durationText = durationSeconds < 60
        ? `${secs} detik`
        : `${mins} menit ${secs} detik`;

      // Hitung juga berapa lama sebelumnya UP (opsional, jika ingin analitik)
      const lastUpDuration = currentStatus.lastUpTime
        ? Math.floor((downSince - new Date(currentStatus.lastUpTime)) / 1000)
        : 0;

      const message = `
✅ <b>Website Kembali Aktif</b> ✅

🌐 <b>URL:</b> ${targetURL}
📈 <b>Status:</b> UP
⏱️ <b>Durasi Down:</b> ${durationText}
📅 <b>Waktu Pemulihan:</b> ${timestamp}
🔗 <b>Uptime Sebelumnya:</b> ~${Math.floor(lastUpDuration / 60)} menit

🔧 <b>Kode Respons:</b> ${response.status}
💬 <b>Pesan:</b> Layanan telah kembali normal.
      `.trim();

      await sendTelegram(message);
      setStatus("up"); // simpan waktu UP terbaru
    }

    return res.status(200).json({ status: "UP", timestamp });
  } catch (err) {
    const errorMessage = err.message || 'Unknown error';
    const statusCode = err.response?.status || 'N/A';

    if (currentStatus.status === "up") {
      // Saat jatuh dari UP ke DOWN, hitung berapa lama sebelumnya UP
      const upSince = currentStatus.lastUpTime ? new Date(currentStatus.lastUpTime) : now;
      const upDuration = Math.floor((now - upSince) / 1000);
      const upMins = Math.floor(upDuration / 60);
      const upSecs = upDuration % 60;
      const upDurationText = upDuration < 60
        ? `${upSecs} detik`
        : `${upMins} menit ${upSecs} detik`;

      const message = `
🚨 <b>Website Mengalami Gangguan</b> 🚨

🌐 <b>URL:</b> ${targetURL}
🔴 <b>Status:</b> DOWN
⏱️ <b>Waktu Aktif Sebelumnya:</b> ${upDurationText}
🔢 <b>Kode HTTP:</b> ${statusCode}
📝 <b>Error:</b> ${errorMessage}
📅 <b>Waktu Mulai:</b> ${timestamp}

🔄 Sistem mencatat waktu downtime...
      `.trim();

      await sendTelegram(message);
      setStatus("down");
    }

    return res.status(200).json({
      status: "DOWN",
      error: errorMessage,
      httpCode: statusCode,
      timestamp,
    });
  }
}

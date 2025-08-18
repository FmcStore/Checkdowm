// utils/statusStore.js
import fs from 'fs';

const filePath = '/tmp/status.json';

export function getStatus() {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        status: parsed.status === "down" ? "down" : "up",
        lastUpTime: parsed.lastUpTime || null,
        downTime: parsed.downTime || null,
      };
    }
  } catch (err) {
    console.error('Gagal baca status:', err);
  }
  return { status: "up", lastUpTime: new Date().toISOString(), downTime: null };
}

export function setStatus(status, time = null) {
  try {
    const now = new Date().toISOString();
    const current = getStatus();

    let data;

    if (status === "up") {
      // Saat naik, hitung berapa lama sebelumnya down (jika perlu)
      data = {
        status: "up",
        lastUpTime: now,
        downTime: null,
      };
    } else if (status === "down") {
      data = {
        status: "down",
        lastUpTime: current.lastUpTime,
        downTime: now,
      };
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Gagal simpan status:', err);
  }
}

import fs from 'fs';
const filePath = '/tmp/status.json'; // hanya bisa dipakai sementara di Vercel

export function getStatus() {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { status: "up", downTime: null };
  }
}

export function setStatus(status, downTime = null) {
  fs.writeFileSync(filePath, JSON.stringify({ status, downTime }));
}

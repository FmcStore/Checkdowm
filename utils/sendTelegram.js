// utils/sendTelegram.js
import axios from 'axios';

const TOKEN = "7690886756:AAFu6e3Xerck9rNSCufwCerp-ooaX6rLqbc";
const CHAT_ID = "8193547847";
const URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`; // perbaiki spasi berlebih

export async function sendTelegram(message) {
  try {
    await axios.post(URL, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML', // agar bisa pakai bold, dll
    });
  } catch (err) {
    console.error('Gagal kirim ke Telegram:', err.response?.data || err.message);
    // Tetap jalan meski gagal kirim notif
  }
}

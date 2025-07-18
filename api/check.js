import { sendTelegram } from '../utils/sendTelegram.js';
import axios from 'axios';

export default async function handler(req, res) {
  const targetURL = "https://defour.nasikfc.my.id";

  try {
    await axios.get(targetURL, { timeout: 5000 });
    res.status(200).json({ status: "UP" });
  } catch (err) {
    await sendTelegram(`❌ Website ${targetURL} sedang DOWN!`);
    res.status(200).json({ status: "DOWN", error: err.message });
  }
}

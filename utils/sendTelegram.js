import axios from 'axios';

const TOKEN = "7690886756:AAFu6e3Xerck9rNSCufwCerp-ooaX6rLqbc";
const CHAT_ID = "8193547847";

export async function sendTelegram(message) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id: CHAT_ID,
    text: message,
  });
}

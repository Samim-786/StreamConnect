const { StreamChat } = require('stream-chat');

const apiKey = process.env.GSTREAM_API_KEY;
const apiSecret = process.env.GSTREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.warn("⚠️ GSTREAM_API_KEY or SECRET missing in .env");
}

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

function generateGStreamToken(userId) {
  if (!userId) throw new Error("Missing userId for GStream token");
  return serverClient.createToken(userId);
}

module.exports = { generateGStreamToken };

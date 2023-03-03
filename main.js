const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const config = require('./config');

const SESSION_FILE_PATH = './session.json';

let sessionData;

try {
  sessionData = require(SESSION_FILE_PATH);
} catch (err) {
  sessionData = null;
}

const client = new Client({
  session: sessionData,
});

client.on('qr', (qr) => {
  console.log('Scan this QR code with your phone:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
  saveSession();
});

client.on('message', async (message) => {
  if (message.body === 'ping') {
    await message.reply('pong');
  }
});

client.initialize();

async function saveSession() {
  const session = await client.getSession();
  await promisify(fs.writeFile)(SESSION_FILE_PATH, JSON.stringify(session));
  console.log('Session data saved.');
}

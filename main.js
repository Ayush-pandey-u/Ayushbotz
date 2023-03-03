const { Client } = require('whatsapp-web.js');

const qrcode = require('qrcode-terminal');

const fs = require('fs');

const { promisify } = require('util');

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

  if (!message.body.startsWith(config.prefix) || message.fromMe) {

    return;

  }

  const args = message.body.slice(config.prefix.length).trim().split(/ +/g);

  const command = args.shift().toLowerCase();

  if (command === 'ping') {

    await message.reply('Pong!');

  } else if (command === 'info') {

    const chat = await message.getChat();

    await message.reply(`Name: ${chat.name}\nDescription: ${chat.description}\nGroup is read-only: ${chat.isReadOnly}\nGroup invite link: ${chat.groupInviteLink}`);

  }

});

client.initialize();

async function saveSession() {

  const session = await client.getSession();

  await promisify(fs.writeFile)(SESSION_FILE_PATH, JSON.stringify(session));

  console.log('Session data saved.');

}


const fs = require("fs");
const { prefix } = require("./config.json");
require('dotenv').config();

//MongoDB
const mongoose = require('mongoose');
(async () => {
  await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Mongoose - Connected to database successfully.");
  }).catch(err => {
    console.error("Mongoose - Could not connect to the database! " + err);
  });
})();

//Discord
const { Client, Collection } = require("discord.js");
const client = new Client({
  disableMentions: "everyone",
  messageCacheMaxSize: 35,
  messageCacheLifetime: 30,
  messageSweepInterval: 60
}, {
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
}, {
  ws: {
    intents: ['GUILDS','GUILD_MEMBERS','GUILD_MESSAGES','GUILD_MESSAGE_REACTIONS','DIRECT_MESSAGES']
  }
});

client.commands = new Collection();
client.events = new Collection();
client.ready = false;

["commands","events"].forEach(handler => {
  require(`./handlers/${handler}.js`)(client);
});

client.login(process.env.BOT_TOKEN);

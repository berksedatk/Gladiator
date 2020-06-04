const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

//Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;

//Website
app.get('/', (req, res) => res.redirect('https://gladiatorbot.glitch.me/'));
server.listen(5000, () => console.log('Listening on port 5000'));

//Top.gg
const DBL = require('dblapi.js');
const dbl = new DBL(process.env.DBL_TOKEN, { webhookAuth: 'homework', webhookServer: server });

//Discord
const Discord = require('discord.js');
const bot = new Discord.Client({ disableMentions: "everyone" });

bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();
bot.dblevents = new Discord.Collection();

["commands", "events","dblevents"].forEach(handler => {
  require(`./util/handlers/${handler}`)(bot, db, dbl);
});

bot.login(process.env.BOT_TOKEN);

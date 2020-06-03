//Mongoose

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection;

const config = require('./config.json');
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const DBL = require('dblapi.js');
   
  //Website
app.get('/', (req, res) => res.redirect('https://gladiatorbot.glitch.me/'));
server.listen(5000, () => console.log('Listening on port 5000'));

//Init
const Discord = require('discord.js');
const bot = new Discord.Client({ disableMentions: "everyone" });

bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

["commands", "events"].forEach(handler => {
  require(`./util/handlers/${handler}`)(bot, db);
});

bot.login(process.env.BOT_TOKEN);

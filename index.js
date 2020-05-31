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
    
  //Top.gg
server.listen(5000, () => console.log('Listening on port 5000'));

const dbl = new DBL(process.env.DBL_TOKEN, { webhookAuth: 'homework', webhookServer: server });
dbl.webhook.on('ready', hook => console.log(`Top.gg - Webhook running with path ${hook.path}`));
dbl.webhook.on("vote", async vote => {
  const user = bot.users.cache.get(vote.user);
  const voteEmbed = new Discord.MessageEmbed()
    .setTitle("**New Vote!**")
    .setTimestamp()
    .setColor("GOLD")
    .setFooter(`Vote by using g!vote command!`)
    .addField(`${user.username}(${user.id})`, `Just voted for the bot!`);
  //bot.channels.cache.get(config.voteChannel).send(voteEmbed);
  //bot.channels.cache.get(config.voteChannelOld).send(voteEmbed);
  try {
    user.send("Thanks for voting! You can vote again in 12 hours.");
    console.log(`User ${user.username} just voted!`);
  } catch (err) {
    console.log(`User ${user.username} just voted but a DM could not be sent!`);
  }
});

//Init
const Discord = require('discord.js');
const bot = new Discord.Client({ disableMentions: "everyone" });

bot.commands = new Discord.Collection();
bot.events = new Discord.Collection();

["commands", "events"].forEach(handler => {
  require(`./util/handlers/${handler}`)(bot, db, dbl);
});

bot.login(process.env.BOT_TOKEN);
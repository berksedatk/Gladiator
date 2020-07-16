const Mute = require("../schemas/mute.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

module.exports = {
  execute(bot) {

    app.get('/', (req, res) => res.redirect('https://gladiatorbot.glitch.me/'));

    bot.user.setActivity(`with Dolphins. | gb!help`, {
      type: "PLAYING"
    });

    require("../util/dbl.js")(bot, server);

    let number = 0;
    setInterval(function() {
      if (number == 0) {
        bot.user.setActivity(`with Dolphins. | g!help`, {
          type: "PLAYING"
        });
        number = 1;
      } else {
        bot.user.setActivity(`a sitcom. | g!help`, {
          type: "WATCHING"
        });
        number = 0;
      }
    }, 30000)

    setInterval(function() {
      Mute.find({}, (err, mutes) => {
        mutes.forEach(mute => {
          if (mute.time != undefined && Date.now() > mute.time) {
            mute.delete().then(() => {
              try {
                bot.guilds.cache.get(mute.guildID).members.cache.get(mute.userID).roles.remove(mute.role)
              } catch(err) {
                console.log(`Could not remove the mute! ${bot.guilds.cache.get(mute.guildID).name} -> ${bot.guilds.cache.get(mute.guildID).members.cache.get(mute.userID).user.tag}`)
              }
            })
          }
        })
      })
    }, 5000)

    Guild.find({}, (err, guilds) => {
      guilds.forEach(guild => {
        if (guild.reactionroles) {
          guild.reactionroles.forEach((messages, channel) => {
            Object.keys(messages).forEach(message => {
              let messageids = Object.keys(guild.reactionroles.get(channel))
              messageids.forEach(async messageid => {
                await bot.channels.cache.get(channel).messages.fetch(messageid)
              })
            })
          })
        }
      })
    })

    console.log("---------------------------------------------")
    console.log("Bot is online.")
    console.log(`Discord Client: ${bot.user.tag} \nServer count: ${bot.guilds.cache.size} \nUser count: ${bot.users.cache.size}`);
  }
}

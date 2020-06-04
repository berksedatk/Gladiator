const Mute = require("../schemas/mute.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  execute(bot) {
    
    //Discord
    console.log("---------------------------------------------")
    console.log("Bot is online.")
    console.log(`Discord Client: ${bot.user.tag} \nServer count: ${bot.guilds.cache.size} \nUser count: ${bot.users.cache.size}`);
  
    bot.user.setActivity(`with Beta tools. | gb!help`, {
      type: "PLAYING"
    });
  
    let number = 0;
    setInterval(function() {
      if (number == 0) {
        bot.user.setActivity(`Dolphins | g!help`, {
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
              bot.guilds.cache.get(mute.guildID).members.cache.get(mute.userID).roles.remove(mute.role)
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
  }
}

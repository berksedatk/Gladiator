const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "removeguild",
  category: "Utility",
  description: "Manually removes a guild",
  dev: true,
  unstaged: true,
  guildOnly: true,
  execute(bot, message, args, db) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      
      if (err) return message.channel.send(`An error occured: ${err}`);
      
      if (!guild) return message.channel.send("This database does not exist!");
      
      if (guild) {
        guild.remove().then(
          () => message.channel.send("Guild has been removed from databse.")
        ).catch(
          err => message.channel.send("Guild could not be removed from database! " + err)
        );
      }
    });   
  }
};
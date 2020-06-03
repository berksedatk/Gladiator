const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "addguild",
  category: "Utility",
  description: "Manually adds a guild",
  dev: true,
  unstaged: true,
  guildOnly: true,
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      
      if (err) return message.channel.send(`An error occured: ${err}`);
      
      if (guild) return message.channel.send("This database already exists!");
      
      if (!guild) {
        const guild = new Guild({
          _id: mongoose.Types.ObjectId(),
          guildName: message.guild.name,
          guildID: message.guild.id,
          blacklisted: false,
          settings: {    
            join: {
              role: null,
              autorole: false,
              channel: "default",
              message: "Welcome to my server!",
              send: false
            },
            levelup: {
              message: "default",
              channel: "default",
              send: true
            },
            blacklist: {
              list: [],
              enabled: false
            },
          },
          cases: {},
          members: {},
          levelroles: {},
          xproles: {},
          reactionroles: {}
        });
        guild.save().then(() => message.channel.send("New Guild has been added to databse.")).catch(err => message.channel.send("New Guild cannot be added to the databse! " + err))
      }
    });   
  }
};

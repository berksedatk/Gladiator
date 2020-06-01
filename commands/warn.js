const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "warn",
  category: "Moderation",
  description: "Warn a user",
  aliases: ["w"],
  usage: "<user> <reason>",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_MESSAGES'],
  execute(bot, message, args, db) {
    if (!args[0]) return message.channel.send(":x: | You have to provide a user to warn.")
    const user = message.mentions.users.first() ? message.mentions.users.first() 
    : (bot.users.cache.get(args[0]) ? bot.users.cache.get(args[0])
    : (bot.users.cache.filter(user => user.username.toLowerCase().includes(args[0].toLowerCase())).first() ? bot.users.cache.filter(user => user.username.toLowerCase().includes(args[0].toLowerCase())).first()
    : null))
    if (user === null) return message.channel.send(":x: | You didn't provide a true user.");
    if (user.id === message.author.id) return message.channel.send(":x: | You cannot warn yourself! At least with a command.")

    args.shift();
    let reason = args.join(" ");
    if (reason.length < 1) reason = "No reason provided."
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
      if (guild) {
        let keys = Array.from(guild.cases.keys())
        let caseNumber = keys.length < 1 ? "0" : (Number(keys.slice(-1).pop()) + 1).toString()
        
        guild.cases.set(caseNumber, {
          user: {
            tag: user.tag,
            id: user.id,
            avatar: user.avatarURL()
          },
          by: {
            tag: message.author.tag,
            id: message.author.id,
            avatar: message.author.avatarURL()
          },
          reason: reason,
          time: Date.now(),
          action: "warn"
        })
        guild.save().then(() => {
          return message.channel.send(`Case ID: \`#${caseNumber}\` \n:white_check_mark: | **${user.tag}** has been warned! **Reason:** ${reason}`)
        }).catch(err => {
          message.channel.send(`An error occured: ${err}`)
        })
      }    
    })
  }
};

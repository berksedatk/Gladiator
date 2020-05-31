const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "kick",
  category: "Moderation",
  description: "Kick someone.",
  aliases: ["k"],
  usage: "<user> <reason>",
  cooldown: 5,
  guildOnly: "true",
  reqPermissions: ["KICK_MEMBERS"],
  execute(bot, message, args) {
    const user = message.mentions.users.first() ? message.mentions.users.first() 
    : (bot.users.cache.get(args[0]) ? bot.users.cache.get(args[0])
    : (bot.users.cache.filter(user => user.username.toLowerCase().includes(args[0].toLowerCase())).first() ? bot.users.cache.filter(user => user.username.toLowerCase().includes(args[0].toLowerCase())).first()
    : null))
    
    if (user === null) return message.channel.send(":x: | You didn't provide a true user.");
    if (user.id === message.author.id) return message.channel.send(":x: | You can't kick yourself, dummy!");
    if (!message.guild.members.cache.get(user.id).kickable) return message.channel.send(":x: | This user is too powerful for me.");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't mute this member, they are too powerful for you.")
    
    args.shift();
    const reason = args[0] ? args : "No reason provided."
    
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
          action: "kick"
        })
        sendEmbed(caseNumber)
      }
      guild.save().catch(err => {
        message.channel.send(`An error occured: ${err}`)
      });
    });
    
    function sendEmbed(caseNumber) {
      try {
        user.send(`You have been **kicked** in **${message.guild.name}** for the reason: \n${args.join(" ")}`)
        message.guild.members.cache.get(user.id).kick(user, {reason: args});
        message.channel.send(`Case ID: \`#${caseNumber}\` \n:white_check_mark: | **${user.tag}** has been kicked! **Reason:** ${reason}`)
      } catch (e) {
        message.channel.send("An error occured: " + e);
      }
    }  
  }
};

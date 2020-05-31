const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ban",
  category: "Moderation",
  description: "Ban someone.",
  aliases: ["b"],
  usage: "<user> <reason>",
  cooldown: 5,
  guildOnly: "true",
  reqPermissions: ["BAN_MEMBERS"],
  async execute(bot, message, args) {
    if (!args[0]) return message.channel.send(":x: | You need to provide a user to ban.");
    
    let user = message.mentions.users.first() ? message.mentions.users.first() 
    : (bot.users.cache.get(args[0]) ? bot.users.cache.get(args[0])
    : (bot.users.cache.filter(user => user.user.username.toLowerCase().includes(args[0].toLowerCase())).size >= 1 ? bot.users.cache.filter(user => user.user.username.toLowerCase().includes(args[0].toLowerCase())).array()
    : null))
    
    if (user.length > 1) {
        let usermsg = "";
        for (let i = 0; i <user.length; i++) {
          usermsg += `\n${i + 1} - ${user[i].name}`
        }
        message.channel.send(`There are multiple users found with name '${args[0]}', which one would you like to use? ${usermsg}`)
        await message.channel.awaitMessages(m => m.author.id === message.author.id, { time:15000, max: 1, errors:['time'] }).then(collected => {
          if (Number(collected.first().content) > user.length) return message.channel.send(":x: | Invalid user number. Command cancelled.");
          user = user[collected.first().content - 1]
        }).catch(err => {
          return message.channel.send(":x: | Command cancelled.")
        });
      } else {
        user = user[0] || user
      }
    
    if (user === null) return message.channel.send(":x: | You didn't provide a true user.");
    if (user.id === message.author.id) return message.channel.send(":x: | You can't ban yourself, dummy!");
    if (!message.guild.members.cache.get(user.id).bannable) return message.channel.send(":x: | This user is too powerful for me.");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't ban this member, they are too powerful for you.")
    
    args.shift();
    const reason = args.join(" ");
    if (reason.length < 1) return message.channel.send(":x: | You didn't provide a reason.");
    
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
          action: "ban"
        })
        sendEmbed(caseNumber)
      }
      guild.save().catch(err => {
        message.channel.send(`An error occured: ${err}`)
      });
    });
    
    function sendEmbed(caseNumber) {
      try {
        user.send(`You have been **banned** in **${message.guild.name}** for the reason: \n${args.join(" ")}`)
        message.guild.members.ban(user, {reason: args.join(" ")});
        message.channel.send(`Case ID: \`#${caseNumber}\` \n:white_check_mark: | **${user.tag}** has been banned! **Reason:** ${reason}`)
      } catch (e) {
        message.channel.send("An error occured: " + e);
      }
    }  
  }
};
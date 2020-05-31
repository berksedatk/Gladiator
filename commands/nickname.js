const Discord = require("discord.js");

module.exports = {
  name: "nickname",
  category: "Moderation",
  description: "Change nickname of members. Leave blank to reset nickname.",
  aliases: ["setnick","nick"],
  usage: "<role/user/mass> [new nickname]",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ["MANAGE_NICKNAMES"],
  execute(bot, message, args) {
    const user = message.mentions.users ? message.mentions.users.first() : (bot.users.cache.get(args[0]) ? bot.users.cache.get(args[0]) : null)
    const menrole = message.mentions.roles.first();
    
    if (!user & !menrole & args[0] != "mass") {
      return message.channel.send(":x: | You must provide a user, a role, or mass to change all nicknames.");
    } 
    
    if (user && !menrole && args[0] != "mass") {
      args.shift();
      let nick = args.join(" ");
      if (nick.length >= 32) return message.channel.send(":x: | Nickname must be 32 or fewer in lenght.");
      
      if (!message.guild.members.cache.get(user.id).manageable && user.id != bot.user.id) return message.channel.send(":x: | This user is way too powerful than me.");
      message.guild.members.cache
        .get(user.id)
        .setNickname(nick, "Requested by " + message.author.username);
      sendNickEmbed(user, nick);
    } else if (!user && menrole && args[0] != "mass") {
      args.shift();
      let nick = args.join(" ");
      if (nick.length >= 32) return message.channel.send(":x: | Nickname must be 32 or fewer in lenght.");
      
      let count = 0;
      message.guild.roles.cache
        .find(grole => grole.name.toLowerCase() == menrole.name.toLowerCase())
        .members.map(member => {
          member.setNickname(nick, "Requested by " + message.author.tag);
          count += 1;
        });
      multipleNickEmbed(menrole, nick, count)
    } else if (!user && !menrole && args[0] == "mass") {
      args.shift();
      let nick = args.join(" ");
      let count = 0;
      message.guild.members.cache.map(member => {
        member.setNickname(nick, "Requested by " + message.author.tag);
          count += 1;
      })
      allNickEmbed(nick, count);
    } else {
      return message.channel.send(":x: | You didn't provide a true operation.");
    }
    
    function allNickEmbed(nick, count) {
      if (nick == "") {
        nick = "none"
      } else {
        nick = `"${nick}"`
      }
      const nickEmbed = new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setTimestamp()
        .setFooter(
          "Requested by " + message.author.tag,
          message.author.avatarURL()
        )
        .setTitle("**All Nicknames Changed!**")
        .addField("Members", count)
        .addField("Nick", `to ${nick}`)
        .addField("Nickname changed by", message.author);
      return message.channel.send(nickEmbed)
    }
    
    function multipleNickEmbed(menrole, nick, count) {
      if (nick == "") {
        nick = "none"
      } else {
        nick = `"${nick}"`
      }
      const nickEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(
          "Requested by " + message.author.tag,
          message.author.avatarURL()
        )
        .setTitle("**Nicknames Changed!**")
        .addField("Role", menrole, true)
        .addField("Members", count, true)
        .addField("Nick", `to ${nick}`)
        .addField("Nickname changed by", message.author);
      return message.channel.send(nickEmbed)
    } 
    
    function sendNickEmbed(user, nick) {
      if (nick == "") {
        nick = "none"
      } else {
        nick = `"${nick}"`
      }
      const nickEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTimestamp()
        .setFooter(
          "Requested by " + message.author.tag,
          message.author.avatarURL()
        )
        .setTitle("**Nickname Changed!**")
        .addField("User", `${user.tag}`)
        .addField("Nick", `to ${nick}`)
        .addField("Nickname changed by", message.author);
      return message.channel.send(nickEmbed);
    }
  }
};

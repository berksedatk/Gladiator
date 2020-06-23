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
  async execute(bot, message, args, db) {
    if (!args[0]) return message.channel.send(":x: | You didn't provide a user.");
    let user = message.mentions.users.first() ? message.mentions.users.first()
      : (message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0])
      : (message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(args[0].toLowerCase())).size > 0 ? message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(args[0].toLowerCase())).array()
      : undefined))
    if (!user) return message.channel.send(":x: | You didn't provide a true user.");

    if (user.length > 1) {
      let usermsg = "";
        for (let i = 0; i < (user.length > 10 ? 10 : user.length); i++) {
      usermsg += `\n${i + 1} -> ${user[i].user.username}`;
      }

      let msg = await message.channel.send("", {embed: {description: `**There are multiple users found with name '${args[0]}', which one would you like to use?** \n${usermsg}`, footer: {text: "You have 30 seconds to respond."}, timestamp: Date.now()}});
      let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] })
      if (Number(collected.first().content) > user.length) return message.channel.send(":x: | Invalid user number. Command cancelled.");
      user = user[collected.first().content - 1]
      msg.delete()
    } else {
      user = user[0] || message.guild.members.cache.get(user.id)
    }

    if (user.id === message.author.id) return message.channel.send(":x: | You cannot warn yourself!");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't warn this member, they are too powerful for you.")

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
            tag: user.user.tag,
            id: user.user.id,
            avatar: user.user.avatarURL()
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
          return message.channel.send(`Case ID: \`#${caseNumber}\` \n:white_check_mark: | **${user.user.tag}** has been warned! **Reason:** ${reason}`)
        }).catch(err => {
          message.channel.send(`An error occured: ${err}`)
        })
      }
    })
  }
};

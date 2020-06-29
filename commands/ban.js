const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");
const find = require("../find.js");

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
    if (!args[0]) return message.channel.send(":x: | You didn't provided a user.");
    let user = await find.guildMember(bot, message, args[0])
    if (!user) return message.channel.send(":x: | You didn't provided true a user.");

    if (user.id === message.author.id) return message.channel.send(":x: | You can't ban yourself, dummy!");
    if (!message.guild.members.cache.get(user.id).bannable) return message.channel.send(":x: | This user is too powerful for me.");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't ban this member, they are too powerful for you.")

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
        user.send(`You have been **banned** in **${message.guild.name}** for the reason: \n${args.join(" ")}`).then(() => {
          message.guild.members.ban(user, {reason: args.join(" ")}).then(() => {
            return message.channel.send(`Case ID: \`#${caseNumber}\` \n:white_check_mark: | **${user.user.tag}** has been banned! **Reason:** ${reason}`);
          }).catch(err => {
            return message.channel.send("I couldn't ban the user, here is the error:" + err);
          });
        }).catch(err => {
          message.guild.members.ban(user, {reason: args.join(" ")}).then(() => {
            return message.channel.send(`Case ID: \`#${caseNumber}\` \n:white_check_mark: | **${user.user.tag}** has been banned and I couldn't inform the user that they are banned, welp. That's not my case ¯\\\_(ツ)\_/¯ **Reason:** ${reason}`);
          }).catch(err => {
            return message.channel.send("I couldn't ban the user, here is the error:" + err);
          });
        });
      } catch (e) {
        message.channel.send("An error occured: " + e);
      }
    }
  }
};

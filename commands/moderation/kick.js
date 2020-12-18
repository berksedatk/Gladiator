const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const mongoose = require("mongoose");
const find = require("../../utility/find.js");

module.exports = {
  name: "kick",
  category: "Moderation",
  description: "Kick someone.",
  aliases: ["k"],
  usage: "<user> <reason>",
  examples: "g!kick thisguy spam\ng!k 495248175808905226",
  cooldown: 5,
  guildOnly: "true",
  reqPermissions: ["KICK_MEMBERS"],
  botPermissions: ["KICK_MEMBERS"],
  async execute(bot, message, args) {

    if (!args[0]) return message.error("You didn't provided a user.", true, this.reason);
    let user = await find.guildMember(bot, message, args[0])
    if (!user) return message.error("You didn't provided a user.", true, this.reason);

    if (user.id === message.author.id) return message.error("You can't kick yourself, dum dum!");
    if (!message.guild.members.cache.get(user.id).kickable) return message.error("This user is too powerful for me.");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.error("You can't kick this member, they are too powerful for you.");

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
        user.send(`You have been **kicked** in **${message.guild.name}** for the reason: \n${args.join(" ")}`).then(() => {
          user.kick(user, {reason: args.join(" ")}).then(() => {
            return message.channel.send(`Case ID: \`#${caseNumber}\` \n**${user.user.tag}** has been kicked! **Reason:** ${reason}`);
          }).catch(err => {
            return message.channel.send("I couldn't kick the user, here is the error:" + err);
          });
        }).catch(err => {
          user.kick(user, {reason: args.join(" ")}).then(() => {
            return message.channel.send(`Case ID: \`#${caseNumber}\` \n**${user.user.tag}** has been kicked and I couldn't inform the user that they are kicked, welp. That's not my case ¯\\\_(ツ)\_/¯ **Reason:** ${reason}`);
          }).catch(err => {
            return message.channel.send("I couldn't kick the user, here is the error:" + err);
          });
        });
      } catch (e) {
        message.channel.send("An error occured: " + e);
      }
    }
  }
};

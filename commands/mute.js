const Discord = require("discord.js");
const mongoose = require("mongoose");
const Mute = require("../schemas/mute.js");
const Guild = require("../schemas/guild.js");
const ms = require("ms");
const prettyms = require("pretty-ms");

module.exports = {
  name: "mute",
  category: "Moderation",
  description: "Mutes a user for a specified time",
  aliases: ["m"],
  usage: "<user> [time(m/h/d)]",
  guildOnly: true,
  reqPermissions: ['KICK_MEMBERS'],
  async execute(bot, message, args) {

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
      let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 })
      if (!collected.first()) return message.channel.send(":x: | Command timed out.")
      if (Number(collected.first().content) > user.length) return message.channel.send(":x: | Invalid user number. Command cancelled.");
      user = user[collected.first().content - 1]
      msg.delete()
    } else {
      user = user[0] || user
    }

    if (user.id === message.author.id) return message.channel.send(":x: | You can't mute yourself. Dummy!");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't mute this member, they are too powerful for you.")
    if (!message.guild.members.cache.get(user.id).bannable) return message.channel.send(":x: | This user is too powerful for me.");

    Mute.findOne({ guildID: message.guild.id, userID: user.id }, async (err, mute) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (mute) return message.channel.send(":x: | This user is already muted!");
      if (!mute) {
        let caseNumber
        let time = args[1] ? (ms(args[1]) || null) : null
        Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
          if (err) return message.channel.send(`An error occured: ${err}`);
          if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
          if (guild) {
            let keys = Array.from(guild.cases.keys())
            caseNumber = await keys.length < 1 ? "0" : (Number(keys.slice(-1).pop()) + 1).toString()

            let reason = time === null ? (args.length > 1 ? args.splice(1, args.length).join(' '): "No reason provided.") : (args.length > 2 ? args.splice(2, args.length).join(' ') : "No reason was provided.")

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
              length: time != null ? time : null,
              time: Date.now(),
              action: "mute"
            })

          }
          guild.save().catch(err => {
            message.channel.send(`An error occured: ${err}`)
          });
        })

        let mutedrole = message.guild.roles.cache.filter(role => role.name.toLowerCase() === "muted").first() || null

        if (mutedrole === null) {
          message.channel.send("There was no muted role detected so created a one!")

          mutedrole = await message.guild.roles.create({
            data: {
              name: "muted",
              position: message.guild.members.cache.get(bot.user.id).roles.highest.position,
              permissions: 1024
            },
            reason: "Muted role was not detected."
          })

          message.guild.channels.cache.forEach(async (channel, id) => {
            await channel.createOverwrite(mutedrole.id , {
              SEND_MESSAGES: false,
              ARR_REACTIONS: false
            })
          })
        }

        const muted = await new Mute({
          _id: mongoose.Types.ObjectId(),
          userID: user.id,
          user: user.tag,
          guildID: message.guild.id,
          guild: message.guild.name,
          time: time + Date.now(),
          role: mutedrole.id
        })

        muted.save().then(() => {
          if (time === null) {
            message.channel.send(`Case: \`#${caseNumber}\` \n:white_check_mark: | **${user.tag}** has been muted.`)
          } else {
            message.channel.send(`Case: \`#${caseNumber}\` \n:white_check_mark: | **${user.tag}** has been muted for ${prettyms(ms(args[1]), {verbose: true})}.`)
          }
          message.guild.members.cache.get(user.id).roles.add(mutedrole)
        }).catch(err => {
          message.channel.send(`An error occured: ${err}`)
        });

      }
    })
  }
};

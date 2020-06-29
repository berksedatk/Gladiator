const Discord = require("discord.js");
const mongoose = require("mongoose");
const Mute = require("../schemas/mute.js");
const Guild = require("../schemas/guild.js");
const ms = require("ms");
const prettyms = require("pretty-ms");
const find = require("../find.js");

module.exports = {
  name: "mute",
  category: "Moderation",
  description: "Mutes a user for a specified time",
  aliases: ["m"],
  usage: "<user> [time(m/h/d)]",
  guildOnly: true,
  reqPermissions: ['KICK_MEMBERS'],
  async execute(bot, message, args) {

    if (!args[0]) return message.channel.send(":x: | You didn't provided a user.");
    let member = await find.guildMember(bot, message, args[0])
    if (!member) return message.channel.send(":x: | You didn't provide a true user.");

    if (member.id === message.author.id) return message.channel.send(":x: | You can't mute yourself. Dummy!");
    if (member.roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't mute this member, they are too powerful for you.")
    if (!member.bannable) return message.channel.send(":x: | This user is too powerful for me.");

    await Mute.findOne({ guildID: message.guild.id, userID: member.id }, async (err, mute) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (mute) return message.channel.send(":x: | This user is already muted!");
      if (!mute) {

        let caseNumber
        let time = args[1] ? (ms(args[1]) || undefined) : undefined
        console.log(time)
        await Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
          if (err) return message.channel.send(`An error occured: ${err}`);
          if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
          if (guild) {

            let keys = Array.from(guild.cases.keys())
            caseNumber = keys.length < 1 ? "0" : (Number(keys.slice(-1).pop()) + 1).toString()

            let reason = time ? (args.length > 1 ? args.splice(1, args.length).join(' '): "No reason provided.") : (args.length > 2 ? args.splice(2, args.length).join(' ') : "No reason was provided.")

            await guild.cases.set(caseNumber, {
              user: {
                tag: member.user.tag,
                id: member.user.id,
                avatar: member.user.avatarURL()
              },
              by: {
                tag: message.author.tag,
                id: message.author.id,
                avatar: message.author.avatarURL()
              },
              reason: reason,
              length: time ? time : null,
              time: Date.now(),
              action: "mute"
            })

          }
          await guild.save().catch(err => {
            message.channel.send(`An error occured: ${err}`)
          });
        })

        let mutedrole = message.guild.roles.cache.filter(role => role.name.toLowerCase() === "muted").first()

        if (!mutedrole) {
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
          userID: member.id,
          user: member.user.tag,
          guildID: message.guild.id,
          guild: message.guild.name,
          time: time ? time + Date.now() : null,
          role: mutedrole.id
        })

        await muted.save().then(() => {
          member.roles.add(mutedrole).then(() => {
            if (!time) {
              message.channel.send(`Case: \`#${caseNumber}\` \n:white_check_mark: | **${member.user.tag}** has been muted.`)
            } else {
              message.channel.send(`Case: \`#${caseNumber}\` \n:white_check_mark: | **${member.user.tag}** has been muted for ${prettyms(time, {verbose: true})}.`)
            }
          }).catch(err => {
            message.channel.send(`An error occured: ${err}`)
          })
        }).catch(err => {
          message.channel.send(`An error occured: ${err}`)
        });
      }
    })
  }
};

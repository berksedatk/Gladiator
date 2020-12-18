const Discord = require("discord.js");
const mongoose = require("mongoose");
const Mute = require("../../schemas/mute.js");
const Guild = require("../../schemas/guild.js");
const ms = require("ms");
const prettyms = require("pretty-ms");
const find = require("../../utility/find.js");

module.exports = {
  name: "mute",
  category: "Moderation",
  description: "Mutes a user for a specified time",
  aliases: ["m"],
  usage: "<user> [time(m/h/d)] [reason]",
  examples: "g!mute Sax#6211 10m ree\ng!m catperson muted",
  guildOnly: true,
  reqPermissions: ['KICK_MEMBERS'],
  botPermissions: ['MANAGE_ROLES','MANAGE_CHANNELS'],
  async execute(bot, message, args) {

    if (!args[0]) return message.error("You didn't provided a user.", true, this.usage);
    let member = await find.guildMember(bot, message, args[0])
    if (!member) return message.error("You didn't provide a true user.", true, this.usage);

    if (member.id === message.author.id) return message.error("You can't mute yourself. Dummy!");
    if (member.roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.error("You can't mute this member, they are too powerful for you.")
    if (!member.bannable) return message.error("This user is too powerful for me.");

    await Mute.findOne({ guildID: message.guild.id, userID: member.id }, async (err, mute) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (mute) return message.error("This user is already muted!");
      if (!mute) {
        args.shift()
        let caseNumber, time
        if (args[0]) {
          if (ms(args[0])) {
            time = args.shift()
            time = ms(time)
          }
        }

        await Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
          if (err) return message.channel.send(`An error occured: ${err}`);
          if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
          if (guild) {

            let keys = Array.from(guild.cases.keys())
            caseNumber = keys.length < 1 ? "0" : (Number(keys.slice(-1).pop()) + 1).toString()

            let reason = args.length > 1 ? args.join(" ") : "No reason was provided."

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
          message.channel.send("<:warning:724052384031965284> | There was no muted role detected so created a one!")

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

        if (mutedrole.position >= message.guild.me.roles.highest.position) return message.error("I can't access the muted role! Please move my role Gladiator higher than the Muted role or move the Muted role lower.")

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
              message.channel.send(`Case: \`#${caseNumber}\` \n**${member.user.tag}** has been muted.`)
            } else {
              message.channel.send(`Case: \`#${caseNumber}\` \n**${member.user.tag}** has been muted for ${prettyms(time, {verbose: true})}.`)
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

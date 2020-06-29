const Mute = require("../schemas/mute.js");
const Guild = require("../schemas/guild.js");
const ms = require("ms");
const find = require("../find.js");

const Discord = require("discord.js");

module.exports = {
  name: "unmute",
  category: "Moderation",
  description: "Unmute a muted user.",
  aliases: ["un-mute"],
  usage: "<user> [reason]",
  guildOnly: true,
  reqPermissions: ['KICK_MEMBERS'],
  async execute(bot, message, args) {

    if (!args[0]) return message.channel.send(":x: | You didn't provided a user.");
    let user = await find.guildMember(bot, message, args[0])
    if (!user) return message.channel.send(":x: | You didn't provide a true user.");

    if (user.id === message.author.id) return message.channel.send(":x: | You can't unmute yourself.");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't unmute this member, they are too powerful for you.")

    await Mute.findOne({ guildID: message.guild.id, userID: user.id }, async (err, mute) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!mute) return message.channel.send(":x: | This user is not muted!");
      if (mute) {
        let caseNumber
        await Guild.findOne({ guildID: message.guild.id }, (err, guild) => {

          let keys = Array.from(guild.cases.keys())
          caseNumber = keys.length < 1 ? "0" : (Number(keys.slice(-1).pop()) + 1).toString()

          let reason = args.length > 1 ? args.splice(1, args.length).join(' ') : "No reason was provided."

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
            action: "unmute"
          })
          guild.save().catch(err => {
            message.channel.send(`An error occured: ${err}`)
          });
        })
        mute.delete().then(() => {
          let mutedrole = message.guild.roles.cache.filter(role => role.name.toLowerCase() === "muted").first() || null

          mutedrole === null ? null : message.guild.members.cache.get(user.id).roles.remove(mutedrole)

          return message.channel.send(`Case: \`#${caseNumber}\` \n:white_check_mark: | **${user.user.tag}** has been un-muted.`);
        }).catch(err => {

        })
      }
    })
  }
};

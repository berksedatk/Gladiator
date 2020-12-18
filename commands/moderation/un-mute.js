const Mute = require("../../schemas/mute.js");
const Guild = require("../../schemas/guild.js");
const ms = require("ms");
const find = require("../../utility/find.js");

const Discord = require("discord.js");

module.exports = {
  name: "un-mute",
  category: "Moderation",
  description: "Unmute a muted user.",
  aliases: ["unmute"],
  usage: "<user> [reason]",
  examples: "g!unmute MEE6\ng!unmute kayle you can talk now",
  guildOnly: true,
  reqPermissions: ['KICK_MEMBERS'],
  botPermissions: ['MANAGE_ROLES'],
  async execute(bot, message, args) {

    if (!args[0]) return message.error("You didn't provided a user.", true, this.usage);
    let user = await find.guildMember(bot, message, args[0])
    if (!user) return message.error("You didn't provide a true user.", true, this.usage);

    if (user.id === message.author.id) return message.error("You can't unmute yourself. Wait... How?!?");
    if (message.guild.members.cache.get(user.id).roles.highest.position >= message.member.roles.highest.position && message.guild.owner.id != message.author.id) return message.error("You can't unmute this member, they are too powerful for you.")

    await Mute.findOne({ guildID: message.guild.id, userID: user.id }, async (err, mute) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!mute) return message.error("This user is not muted!");
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

          return message.channel.send(`Case: \`#${caseNumber}\` \n<:tick:724048990626381925> | **${user.user.tag}** has been un-muted.`);
        }).catch(err => {

        })
      }
    })
  }
};

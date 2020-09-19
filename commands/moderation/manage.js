const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const find = require("../../find.js");
const w3color = require("../../w3color.js");

module.exports = {
  name: "manage",
  category: "Moderation",
  description: "Manage a user's profile.",
  usage: "<user> <xp - level - color - reset>",
  examples: "g!manage @Sax#6211 xp add 100\ng!manage SpammerGuy level set 1\ng!manage 564393040308076544 reset",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  async execute(bot, message, args) {
    if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a user.");
    let user = await find.guildMember(bot, message, args[0])
    if (!user) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true user.")
    user = user.user

    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        let member = guild.members.get(user.id)
        if (!member) {
          guild.members.set(user.id, {
            username: user.tag,
            id: user.id,
            xp: "0",
            level: "0",
            color: "#add8e6",
            lastxpmessage: 0
          })
          member = {
            username: user.tag,
            id: user.id,
            xp: "0",
            level: "0",
            color: "#add8e6",
            lastxpmessage: 0
          }
          guild.save().catch(err => message.channel.send(`An error occured: ${err}`));
        }
        if (!args[1]) {
          return message.channel.send("<:cross:724049024943915209> | You didn't provide a option, `xp, level, color, reset`");
        } else if (args[1].toLowerCase() == "xp") {
          if (!args[2]) {
            return message.channel.send("<:cross:724049024943915209> | You didn't provide a option, `add, remove, set`");
          } else if (args[2].toLowerCase() == "add") {
            if (!args[3]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a amount of xp to add.")
            if (args[3] < 0) return message.channel.send("<:cross:724049024943915209> | You can't add negative amount of xp.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: String(Number(member.xp) + Number(args[3])),
              level: member.level,
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | ${args[3]} xp has been added to the user, now they have ${Number(member.xp) + Number(args[3])} xp in total.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[2].toLowerCase() == "remove") {
            if (!args[3]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a amount of xp to remove.")
            if (args[3] < 0) return message.channel.send("<:cross:724049024943915209> | You can't remove negative amount of xp.");
            if (member.xp - args[3] < 0) return message.chanel.send("<:cross:724049024943915209> | You can't remove this much xp, total xp can't be negative.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: String(Number(member.xp) - Number(args[3])),
              level: member.level,
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | ${args[3]} xp has been removed from the user, now they have ${Number(member.xp) - Number(args[3])} xp in total.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[2].toLowerCase() == "set") {
            if (!args[3]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a amount of xp to set.")
            if (args[3] < 0) return message.channel.send("<:cross:724049024943915209> | You can't set to negative amount of xp.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: args[3],
              level: member.level,
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | User's xp has been set to ${args[3]} successfully.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          }
        } else if (args[1].toLowerCase() == "level") {
          if (!args[2]) {
            return message.channel.send("<:cross:724049024943915209> | You didn't provide a option, `add, remove, set`");
          } else if (args[2].toLowerCase() == "add") {
            if (!args[3]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a amount of level to add.")
            if (args[3] < 0) return message.channel.send("<:cross:724049024943915209> | You can't add negative amount of level.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: member.xp,
              level: String(Number(member.level) + Number(args[3])),
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | ${args[3]} level has been added to the user, now they are in level ${Number(member.level) + Number(args[3])}.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[2].toLowerCase() == "remove") {
            if (!args[3]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a amount of level to remove.")
            if (args[3] < 0) return message.channel.send("<:cross:724049024943915209> | You can't remove negative amount of level.");
            if (member.level - args[3] < 0) return message.chanel.send("<:cross:724049024943915209> | You can't remove this much level, user's level can't be negative.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: member.xp,
              level: String(Number(member.level) - Number(args[3])),
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | ${args[3]} level has been removed from the user, now they are in level ${Number(member.level) - Number(args[3])}.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[2].toLowerCase() == "set") {
            if (!args[3]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a amount of xp to set.")
            if (args[3] < 0) return message.channel.send("<:cross:724049024943915209> | You can't set to negative amount of xp.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: member.xp,
              level: args[3],
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | User's level has been set to ${args[3]} successfully.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          }
        } else if (args[1].toLowerCase() == "reset") {
          let profileEmbed = new Discord.MessageEmbed()
          .setAuthor(`${member.username}'s Profile`, user.avatarURL())
          .setColor(member.color.toUpperCase())
          .addField("Level", member.level, true)
          .addField("Total Xp", `${Number(member.xp) + factorial(member.level) * 560} xp`,true)
          .addField("Xp for next level", `${member.xp}/${(Number(member.level) + 1) * 560}`)
          .addField("Profile Color", member.color)
          message.channel.send(`Are you sure you want to reset this user's profile? \`yes, no\``, {embed: profileEmbed}).then(async msg => {
            let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
            if (!collected.first()) return message.channel.send("<:cross:724049024943915209> | Command timed out.");
            if (collected.first().content.toLowerCase() != "yes" || collected.first().content.toLowerCase() != "y") return message.channel.send("<:cross:724049024943915209> | Command cancelled.");
            guild.members.set(user.id, {
              username: user.tag,
              id: user.id,
              xp: "0",
              level: "0",
              color: "#add8e6",
              lastxpmessage: 0
            })
            msg.delete()
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | User's profile has been reset successfully.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          })
        }
      }
    })
  }
};

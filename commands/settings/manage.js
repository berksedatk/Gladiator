const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const find = require("../../utility/find.js");
const w3color = require("../../utility/w3color.js");

module.exports = {
  name: "manage",
  category: "Settings",
  description: "Manage a user's profile.",
  usage: "<user> <xp - level - reset>",
  examples: "g!manage @Sax#6211 xp add 100\ng!manage SpammerGuy level set 1\ng!manage 564393040308076544 reset",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  async execute(bot, message, args) {
    if (!args[0]) return message.error("You didn't provide a user.", true, this.usage);
    let user = await find.guildMember(bot, message, args[0])
    if (!user) return message.error("You didn't provide a true user.", true, this.usage)
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
          return message.error("You didn't provide a option, `xp, reset`", true, "user <xp - reset>");
        } else if (args[1].toLowerCase() == "xp") {
          if (!args[2]) {
            return message.error("You didn't provide a option, `add, remove, set`", true, "user xp <add - remove - set>");
          } else if (args[2].toLowerCase() == "add") {
            if (!args[3]) return message.error("You didn't provide a amount of xp to add.", true ,"user xp add <amount>")
            if (args[3] < 0) return message.error("You can't add negative amount of xp.");
            if (Number(member.xp) + Number(args[3]) > 99999999) return message.error("User's xp cannot exceed 99,999,999 xp.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: String(Number(member.xp) + Number(args[3])),
              level: member.level,
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.success(`${args[3]} xp has been added to the user, now they have ${Number(member.xp) + Number(args[3])} xp in total.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[2].toLowerCase() == "remove") {
            if (!args[3]) return message.error("You didn't provide a amount of xp to remove.", true, "user xp remove <amount>")
            if (args[3] < 0) return message.error("You can't remove negative amount of xp.");
            if (member.xp - args[3] < 0) return message.error("You can't remove this much xp, total xp can't be negative.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: String(Number(member.xp) - Number(args[3])),
              level: member.level,
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.success(`${args[3]} xp has been removed from the users total xp, now they have ${Number(member.xp) - Number(args[3])} xp in total.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[2].toLowerCase() == "set") {
            if (!args[3]) return message.error("You didn't provide a amount of xp to set.", true, "user xp set <amount>")
            if (args[3] < 0) return message.error("You can't set to negative amount of xp.");
            if (Number(member.xp) + Number(args[3]) > 99999999) return message.error("User's xp cannot exceed 99,999,999 xp.");
            guild.members.set(member.id, {
              username: member.username,
              id: member.id,
              xp: args[3],
              level: member.level,
              color: member.color,
              lastxpmessage: member.lastxpmessage
            })
            guild.save().then(() => message.success(`User's total xp has been set to ${args[3]} successfully.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          }
        } else if (args[1].toLowerCase() == "reset") {
          let profileEmbed = new Discord.MessageEmbed()
          .setAuthor(`${member.username}'s Profile`, user.avatarURL())
          .setColor(member.color.toUpperCase())
          .addField("Level", level(member.xp), true)
          .addField("Total Xp", `${member.xp} xp`,true)
          .addField("Xp for next level", `${member.xp - (combine(level(member.xp)) * 560)}/${(level(member.xp) + 1) * 560}`)
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
            guild.save().then(() => message.success(`User's profile has been reset successfully.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          })
        }
      }
    })
  }
};


function combine(num) {
  if (num < 0) return -1;
  else if (num == 0) return 0;
  else return (num + combine(num - 1));
};

function level(num) {
 num = Math.floor(num / 560);
 for (lvl = 0; num >= combine(lvl +1); lvl++);
 return lvl;
};

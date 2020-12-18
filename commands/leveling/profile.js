const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const find = require("../../utility/find.js");
const w3color = require("../../utility/w3color.js");

module.exports = {
  name: "profile",
  category: "Leveling",
  description: "List leveling profile info",
  aliases: ["level","xp","p"],
  usage: "[user - color]",
  examples: "g!profile color #B00B69\ng!profile @VeryCoolDude6969",
  cooldown: 5,
  guildOnly: true,
  async execute(bot, message, args) {
    let user;
    if (!args[0]) {
      user = message.author
      profile(user)
    } else if (args[0].toLowerCase() === "color") {
      args.shift()
      let color = args.join()
      if (color.length < 1) return message.error("You didn't provide a color to set for your profile", true, "color <color name/hex/rgb>")
      if (!w3color(color).valid) return message.error("You didn't provide a true color.\n A color can be name, hex, rgb, hsl, hwb, cmyk or a ncol.")

      Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
        if (err) return message.channel.send(`An error occured: ${err}`);
        if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
        let member = guild.members.get(message.author.id)
        if (!member) {
          member = guild.members.set(message.author.id, {
            username: message.author.tag,
            id: message.author.id,
            xp: "0",
            level: "0",
            color: w3color(color).toHexString(),
            lastxpmessage: 0
          })
          guild.save().then(() => {return message.success(`Your profile color has been changed to ${w3color(color).toHexString()}`)}).catch(err => message.channel.send(`An error occured: ${err}`));
        } else {
          member = guild.members.set(message.author.id, {
            username: message.author.tag,
            id: message.author.id,
            xp: member.xp,
            level: member.level,
            color: w3color(color).toHexString(),
            lastxpmessage: member.lastxpmessage
          })
          guild.save().then(() => {return message.success(`Your profile color has been changed to ${w3color(color).toHexString()}`)}).catch(err => message.channel.send(`An error occured: ${err}`));
        }
      })
    } else {
      await message.guild.members.fetch()
      user = await find.guildMember(bot, message, args[0])
      if (!user) return message.error("You didn't provide a true user.", true, "<user mention/name>")
      user = user.user
      profile(user)
    }
    function profile(user) {
      Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
        if (err) return message.channel.send(`An error occured: ${err}`);
        if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
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

          await message.guild.members.fetch()

          let users = [];
          guild.members.forEach(membere => {
            if (membere.xp >= 0) {
              users.push({
                user: membere.username,
                xp: membere.xp,
              });
            }
          });

          users.sort((a, b) => b.xp - a.xp);
          let rank;
          for (let i = 0; i < users.length; i++) {
            if (users[i].user === member.username) rank = i + 1
          }

          let profileEmbed = new Discord.MessageEmbed()
          .setAuthor(`${member.username}'s Profile`, user.avatarURL())
          .setColor(member.color.toUpperCase())
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
          .addField("Level", level(member.xp), true)
          .addField("Server Rank", `#${rank}`, true)
          .addField("Total Xp", `${member.xp} xp`)
          .addField("Xp for next level", `${member.xp - (combine(level(member.xp)) * 560)}/${(level(member.xp) + 1) * 560}`, true)
          .addField("Profile Color", member.color, true)
          message.channel.send(profileEmbed)
        }
      })
    }
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

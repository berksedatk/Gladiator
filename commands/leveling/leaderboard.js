const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

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

module.exports = {
  name: "leaderboard",
  category: "Leveling",
  description: "See the leaderboard for the server.",
  aliases: ["lb"],
  usage: "[page number]",
  cooldown: 5,
  guildOnly: true,
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.error(`An error occured: ${err}`);
      if (!guild) return message.error("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {

        await message.guild.members.fetch()

        let users = [];
        let top = [];
        await guild.members.forEach(async member => {
          if (member.xp >= 0) {
            let lvl = level(member.xp)
            let xp = member.xp
            users.push({
              user: member.username,
              xp: xp,
              lvl: level(member.xp)
            });
          }
        });

        users.sort((a, b) => b.xp - a.xp);
        let countlb = users.length < 10 ? users.length : 10;

        const pages = Math.floor(users.length / 10) + 1
        const extra = users.length % 10

        const goto = (args[0] - 1) * 10

        let page = ""
        if (!args[0]) {
          for (let i = 0; i < countlb; i++) {
            top.push(`${i == 0 ? ':crown:' : (i === 1 ? ':second_place:' : (i === 2 ? ':third_place:': `${i + 1}.`))} ${users[i].user} | Xp: ${users[i].xp} | Level: ${users[i].lvl}`)
          }
          page = `1/${pages}`
        } else {
          if (Number(args[0]) > pages || Number(args[0]) < 1) return message.error("This page does not exist.");
          for (let i = goto; i < goto + extra; i++) {
            top.push(`${i == 0 ? ':crown:' : (i === 1 ? ':second_place:' : (i === 2 ? ':third_place:': `${i + 1}.`))} ${users[i].user} | Xp: ${users[i].xp} | Level: ${users[i].lvl}`)
          }
          page = `${args[0]}/${pages}`
        }

        let place;
        let count = 1;
        users.forEach(userz => {
          if (userz.user === message.author.tag) {
            place = count == 0 ? `Not ranked yet.` : `${count}. Place`;
          } else {
            count += 1;
          }
        });

        const lbEmbed = new Discord.MessageEmbed()
        .setAuthor(`${message.guild.name} Leaderboard`, message.guild.iconURL())
        .setColor("GOLD")
        .setFooter(`Page of ${page} - Requested by ${message.author.tag}`, message.author.avatarURL())
        .setDescription(top)
        .addField("Your place", place);
        message.channel.send(lbEmbed);
      }
    });
  }
};

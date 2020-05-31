const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

function factorial(num) {
  if (num === 0) {
    return 0;
} if (num === 1)
    return 1;
  for (var i = num - 1; i >= 1; i--) {
    num += i;
  }
  return num;
}


module.exports = {
  name: "leaderboard",
  category: "Leveling",
  description: "See the leaderboard for the server.",
  aliases: ["lb"],
  cooldown: 5,
  guildOnly: true,
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        
        let users = [];
        let top = [];
        guild.members.forEach(member => {
          const lvl = member.level
          const lastxp = member.xp + factorial(lvl) * 560
          users.push({
            user: member.username,
            xp: lastxp,
            lvl: member.level
          });
        });
        
        users.sort((a, b) => b.xp - a.xp);
        let countlb = users.length < 10 ? users.length : 10;
        
        for (let l = 0; l < countlb; l++) {
          if (l === 0) {
            top.push(`:crown: ${users[l].user} | Xp: ${users[l].xp} | Level: ${users[l].lvl}`);
          } else if (l === 1) {
            top.push(`:second_place: ${users[l].user} | Xp: ${users[l].xp} | Level: ${users[l].lvl}`);
          } else if (l === 2) {
            top.push(`:third_place: ${users[l].user} | Xp: ${users[l].xp} | Level: ${users[l].lvl}`);
          } else {
            top.push(`${l + 1}. ${users[l].user} | Xp: ${users[l].xp} | Level: ${users[l].lvl}`);
          }
        }
        
        let place;
        let count = 1;
        users.forEach(userz => {
          if (userz.user === message.author.tag) {
            place = count;
          } else {
            count += 1;
          }
        });
        
        const lbEmbed = new Discord.MessageEmbed()
        .setAuthor("Top 10 Leaderbaord", message.guild.iconURL())
        .setTimestamp()
        .setColor("GOLD")
        .setFooter("Requested by " + message.author.tag,message.author.avatarURL())
        .setDescription(top)
        .addField("Your place", `${place}. Place`);
      message.channel.send(lbEmbed);
      }
    });
  }
};
const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const mongoose = require("mongoose");
const find = require("../../utility/find.js");
const prettyms = require("pretty-ms");

module.exports = {
  name: "punishments",
  category: "Moderation",
  description: "Lists all the punishments of a user",
  aliases: ["cases"],
  usage: "[user]",
  cooldown: 5,
  guildOnly: true,
  async execute(bot, message, args) {
    let user;
    if (args[0]) {
      user = await find.guildMember(bot, message, args[0])
      if (!user) return message.error("You didn't provide a true user.", true, this.usage);
      user = user.user
    } else {
      user = message.author
    }

    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        let list = [];
        const keys = guild.cases.keys()
        guild.cases.forEach((casee, key) => {
          if (casee.user.id === user.id) {
            let listmsg = `**Issued User:** ${casee.user.tag}(${casee.user.id}) \n**Action:** ${casee.action} \n**Reason:** ${casee.reason}`

            casee.action === "mute" ? (casee.length === null ? listmsg += `\n**Muted for:** No time was provided.` : listmsg += `\n**Muted for:** ${prettyms(casee.length, {verbose: true})}`) : false
            list.push({ title: `**Case ID:** #${key}`, field: listmsg})
          }
        })

        const casesEmbed = new Discord.MessageEmbed()
        .setAuthor(`${user.tag}'s Cases`, user.avatarURL())
        .setColor("RED")

        const pages = Math.floor(list.length/10)
        const extra = list.length%10

        const goto = args[1] ? (args[1] - 1) * 10 : 0

        if (pages > 0) {
          if (args[1]) {
            if (args[1] > pages + 1) return message.channel.send("<:cross:724049024943915209> | This page does not exist.")
            for (let i = goto; i < goto + extra; i++) {
              casesEmbed.addField(list[i].title, list[i].field)
            }
            casesEmbed.setFooter(`Page of ${args[1]}/${pages + 1} - Requested by ${message.author.tag}`, message.author.avatarURL())
          } else {
            for (let i = 0; i < 10; i++) {
              casesEmbed.addField(list[i].title, list[i].field)
            }
            casesEmbed.setFooter(`Page of 1/${pages + 1} - Requested by ${message.author.tag}`, message.author.avatarURL())
          }
        } else {
          list <= 0 ? casesEmbed.setDescription(" - No recorded cases.") : list.forEach(Case => casesEmbed.addField(Case.title, Case.field))
          casesEmbed.setFooter(`Page of 1/1 - Requested by ${message.author.tag}`, message.author.avatarURL())
        }

        message.channel.send(casesEmbed)
      }
    })
  }
};

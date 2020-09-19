const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const mongoose = require("mongoose");
const prettyms = require("pretty-ms");

module.exports = {
  name: "case",
  category: "Moderation",
  description: "Get information about a case by their ID",
  usage: "<case ID>",
  examples: "g!case 69",
  cooldown: 5,
  guildOnly: true,
  execute(bot, message, args, db) {
    if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a case ID.")
    const caseNumber = args[0]
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
      if (guild) {
        const cases = guild.cases.get(caseNumber) ? guild.cases.get(caseNumber) : false
        if (!cases) return message.channel.send(":x: | A case with this ID does not exist!")
        let casemsg = `**Issued by:** <@${cases.by.id}>(${cases.by.id}) \n**Action:** ${cases.action} \n**Reason:** ${cases.reason}`

        cases.action === "mute" ? (cases.length === null ? casemsg += `\n**Muted for:** No time was provided.` : casemsg += `\n**Muted for:** ${prettyms(cases.length, {verbose: true})}`) : false
        const caseEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("GOLD")
        .setFooter(`Case ID: #${caseNumber}/${guild.cases.size}`)
        .setAuthor(`${cases.user.tag}(${cases.user.id})`, cases.user.avatar)
        .setDescription(casemsg)
        return message.channel.send(caseEmbed);
      }
    });
  }
};

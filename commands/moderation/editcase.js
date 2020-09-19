const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "editcase",
  category: "Moderation",
  description: "Edit a case by their case ID",
  usage: "<case ID>",
  examples: "g!editcase 1 spam",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_MESSAGES'],
  execute(bot, message, args, db) {
    if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a case ID.")
    const caseNumber = args[0]
    args.shift()
    const updated = args.join(" ")
    if (updated.length < 1) return message.channel.send("<:cross:724049024943915209> | You didn't provide the updated reason.");
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
      if (guild) {
        const cases = guild.cases.get(caseNumber) ? guild.cases.get(caseNumber) : false
        if (!cases) return message.channel.send("<:cross:724049024943915209> | This case does not exist!")

        let casemsg = `**Issued by:** <@${cases.by.id}>(${cases.by.id}) \n**Action:** ${cases.action} \n**Updated Reason:** ${updated}`

        guild.cases.set(caseNumber, {
          user: {
            tag: cases.user.tag,
            id: cases.user.id,
            avatar: cases.user.avatar
          },
          by: {
            tag: cases.by.tag,
            id: cases.by.id,
            avatar: cases.by.avatar
          },
          reason: updated,
          time: cases.time,
          action: cases.action
        })

        const caseEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("GOLD")
        .setFooter(`Case ID: #${caseNumber}/${guild.cases.size}`)
        .setAuthor(`${cases.user.tag}(${cases.user.id})`, cases.user.avatar)
        .setDescription(casemsg)

        guild.save().then(() => message.channel.send("<:tick:724048990626381925> | Case has been edited successfully.", {embed: caseEmbed})).catch(err => message.channel.send(`An error occured: ${err}`))
      }
    })
  }
};

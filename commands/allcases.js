const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");
const ms = require("ms");
const prettyms = require("pretty-ms");

module.exports = {
  name: "allcases",
  category: "Moderation",
  description: "See all the cases",
  cooldown: 5,
  guildOnly: true,
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        
        const casesEmbed = new Discord.MessageEmbed()
        .setAuthor("All Recorded Cases")
        .setColor("RED")
        
        let list = [];
        let embedlist = [];
        guild.cases.forEach((cases, key) => {
          let listmsg = `**Issued User:** ${cases.user.tag}(${cases.user.id}) \n**Issued By**: <@${cases.by.id}>(${cases.by.id}) \n**Action:** ${cases.action} \n**Reason:** ${cases.reason}`
          
          cases.action === "mute" ? (cases.length === null ? listmsg += `\n**Muted for:** No time was provided.` : listmsg += `\n**Muted for:** ${prettyms(cases.length, {verbose: true})}`) : false
          list.push({ title: `**Case ID:** #${key}`, field: listmsg})
        })
        
        
        const pages = Math.floor(list.length / 10)
        const extra = list.length % 10
        
        const goto = (args[0] - 1) * 10
        
        if (pages > 0) {
          if (args[0]) {
            if (args[0] > pages + 1) return message.channel.send(":x: | This page does not exist.")
            for (let i = goto; i < goto + 10; i++) {
              casesEmbed.addField(list[i].title, list[i].field)
            }
            casesEmbed.setFooter(`Page of ${args[0]}/${pages + 1} - Requested by ${message.author.tag}`, message.author.avatarURL())
          } else {
            for (let i = 0; i < 10; i++) {
              casesEmbed.addField(list[i].title, list[i].field)            
            }
            casesEmbed.setFooter(`Page of 1/${pages + 1} - Requested by ${message.author.tag}`, message.author.avatarURL())
          }
        } else {
          list.forEach(Case => {
            casesEmbed.addField(Case.title, Case.field) 
          })
          casesEmbed.setFooter(`Page of 1/1 - Requested by ${message.author.tag}`, message.author.avatarURL())
        }
        message.channel.send(casesEmbed)
      }
    })
  }
};
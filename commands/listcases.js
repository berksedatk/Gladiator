const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");
const prettyms = require("pretty-ms");

module.exports = {
  name: "listcases",
  category: "Moderation",
  description: "View your cases or a user's",
  aliases: ["punishments"],
  usage: "[user] [page]",
  cooldown: 5,
  guildOnly: true,
  execute(bot, message, args) {
    let user;
    if (!args[0]) {
      user = message.author   
    } else {
      user = message.mentions.users.first() ? message.mentions.users.first() 
      : (bot.users.cache.get(args[0]) ? bot.users.cache.get(args[0])
      : (bot.users.cache.filter(user => user.username.includes(args[0])).first() ? bot.users.cache.filter(user => user.username.includes(args[0])).first()
      : null))
      if (user === null) return message.channel.send(":x: | You didn't provide a true user.");
    }
      
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        let list = [];
        let embedlist = [];
        const keys = guild.cases.keys()
        guild.cases.forEach((casee, key) => {
          if (casee.user.id === user.id) {
            let listmsg = `**Issued User:** ${cases.user.tag}(${cases.user.id}) \n**Issued By**: <@${cases.by.id}>(${cases.by.id}) \n**Action:** ${cases.action} \n**Reason:** ${cases.reason}`
          
            cases.action === "mute" ? (cases.length === null ? listmsg += `\n**Muted for:** No time was provided.` : listmsg += `\n**Muted for:** ${prettyms(cases.length, {verbose: true})}`) : false
            list.push({ title: `**Case ID:** #${key}`, field: listmsg})            
          }
        })
        
        const casesEmbed = new Discord.MessageEmbed()
        .setAuthor(`${user.tag}'s Cases`, user.avatarURL())
        .setColor("RED")
        
        const pages = Math.floor(list.length/10)
        const extra = list.length%10
        
        const goto = (args[1] - 1) * 10
        
        if (pages > 0) {
          if (args[1]) {
            if (args[1] > pages + 1) return message.channel.send(":x: | This page does not exist.")
            for (let i = goto; i < goto + 10; i++) {
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
          embedlist = list[0] ? list : "- No recorded cases."          
          casesEmbed.setFooter(`Page of 1/1 - Requested by ${message.author.tag}`, message.author.avatarURL())
        }
        
        list < 1 ? casesEmbed.setDescription(" - No recorded cases.") : list.forEach(Case => casesEmbed.addField(Case.title, Case.field))
        casesEmbed.setFooter(`Page of 1/1 - Requested by ${message.author.tag}`, message.author.avatarURL())
        message.channel.send(casesEmbed)
      }
    })
  }
};

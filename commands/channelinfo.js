const Discord = require("discord.js");

module.exports = {
  name: "channelinfo",
  category: "Utility",
  description: "Lists the information about a specified channel.",
  usage: "[channel]",
  cooldown: 5,
  guildOnly: "true",
  async execute(bot, message, args) {
    let channel;
    if (!args[0]) {
      channel = message.channel;
      let parentName = "";
      if (channel.parentID === null) {
        parentName = "null";
      } else {
        parentName = bot.channels.cache.get(channel.parentID).name;
      }
      sendChannelEmbed(channel, parentName);
    } else if (args[0]) {
      
     channel = message.mentions.channels.first() ? message.mentions.channels.first()
      : (message.guild.channels.cache.get(args[0]) ? message.guild.channels.cache.get(args[0])
      : (message.guild.channels.cache.filter(channel => channel.name.includes(args[0].toLowerCase())).size >= 1 ? message.guild.channels.cache.filter(channel => channel.name.includes(args[0].toLowerCase())).array()
      : null))
      
      if (channel === null) return message.channel.send(":x: | You didn't provide a true channel.");
      if (channel.length > 1) {
        let channelmsg = "";
        for (let i = 0; i < channel.length; i++) {
          channelmsg += `\n${i + 1} - ${channel[i].name}`
        }
        message.channel.send(`There are multiple channels found with name '${args[0]}', which one would you like to use? ${channelmsg}`)
        await message.channel.awaitMessages(m => m.author.id === message.author.id, { time:15000, max: 1, errors:['time'] }).then(collected => {
          if (collected.first().content > channel.length) return message.channel.send(":x: | Invalid channel number. Command cancelled.");
          channel = channel[collected.first().content - 1]
        }).catch(err => {
          return message.channel.send(":x: | Command cancelled.")
        });
      } else {
        channel = channel[0] || channel
      }
      
      let parentName = "";
      if (channel.parentID === null) {
        parentName = "null";
      } else {
        parentName = bot.channels.cache.get(channel.parentID).name;
      }
      sendChannelEmbed(channel, parentName);
    }

    function sendChannelEmbed(channel, parentName) {
      const channelEmbed = new Discord.MessageEmbed()
        .setTitle(`**${channel.name}**`)
        .setTimestamp()
        .setColor("BLUE")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
        .addField("Type", channel.type, true)
        .addField("Position", `${channel.rawPosition}/${message.guild.channels.cache.size}`, true)        
        .addField("Nsfw", channel.nsfw, true)
        .addField("Id", `\`${channel.id}\``, true)
        .addField("Category", parentName + `(\`${channel.parentID}\`)`, true)
        .addField("Topic", channel.topic === null ? "No Topic" : channel.topic);       
      return message.channel.send(channelEmbed);
    }
  }
};

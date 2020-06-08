const Discord = require("discord.js");

module.exports = {
  name: "channelinfo",
  category: "Utility",
  description: "Lists the information about a specified channel.",
  aliases: ["ci"],
  usage: "[channel]",
  cooldown: 5,
  guildOnly: "true",
  async execute(bot, message, args) {

    if (!args[0]) {
      let parentName = message.channel.parentID === null ? "No Category." : bot.channels.cache.get(message.channel.parentID).name;
      sendChannelEmbed(message.channel, parentName);
    } else if (args[0]) {

      let channel = message.mentions.channels.first() ? message.mentions.channels.first()
      : (message.guild.channels.cache.get(args[0]) ? message.guild.channels.cache.get(args[0])
      : (message.guild.channels.cache.filter(channel => channel.name.toLowerCase().includes(args[0].toLowerCase())).size >= 1 ? message.guild.channels.cache.filter(channel => channel.name.toLowerCase().includes(args[0].toLowerCase())).array()
      : undefined))
      if (!channel) return message.channel.send(":x: | You didn't provide a true channel.");

      if (channel.length > 1) {
        let channelmsg = "";
        for (let i = 0; i < (channel.length > 10 ? 10 : channel.length); i++) {
          channelmsg += `\n${i + 1} - ${channel[i].name}`
        }
        let msg = await message.channel.send("", {embed: {description: `**There are multiple channels found with name '${args[0]}', which one would you like to use?** \n${channelmsg}`, footer: {text: "You have 30 seconds to respond."}, timestamp: Date.now()}});
        let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 })
        if (!collected.first()) return message.channel.send(":x: | Command timed out.")
        if (Number(collected.first().content) > channel.length) return message.channel.send(":x: | Invalid channel number. Command cancelled.");
        channel = channel[collected.first().content - 1]
        msg.delete()
      } else {
        channel = channel[0] || channel
      }

      let parentName = channel.parentID === null ? "No Category" : bot.channels.cache.get(channel.parentID).name;
      sendChannelEmbed(channel, parentName);
    }

    function sendChannelEmbed(channel, parentName) {
      const channelEmbed = new Discord.MessageEmbed()
        .setTitle(`${channel.name}`)
        .setTimestamp()
        .setColor("BLUE")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
        .addField('Channel ID', channel.id)
        .addField("Channel Type", channel.type[0].toUpperCase() + channel.type.substr(1), true)
        .addField("Position", `${channel.rawPosition}/${message.guild.channels.cache.size}`, true)
      if (channel.parentID && channel.type != "voice") {
        channelEmbed.addField("Nsfw", String(channel.nsfw)[0].toUpperCase() + String(channel.nsfw).substr(1), true)
        channelEmbed.addField("Category", `${parentName}(${channel.parentID})`, true)
        channelEmbed.addField("Topic", channel.topic === null ? "No Topic" : channel.topic)
      }
      return message.channel.send(channelEmbed);
    }
  }
};

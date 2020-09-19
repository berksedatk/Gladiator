const Discord = require("discord.js");
const prettyms = require("pretty-ms");
const find = require("../../find.js");

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

      let channel = await find.channel(bot, message, args[0])
      if (!channel) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true channel.")

      let parentName = channel.parentID === null ? "No Category" : bot.channels.cache.get(channel.parentID).name;
      sendChannelEmbed(channel, parentName);
    }

    function sendChannelEmbed(channel, parentName) {
      const channelEmbed = new Discord.MessageEmbed()
        .setTitle(`${channel.name}`)
        .setTimestamp()
        .setColor("BLUE")
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
        .setDescription(`Channel ID: ${channel.id}`)
        .addField("Created At:", `${channel.createdAt.toUTCString()}\n(${prettyms(Date.now() - channel.createdTimestamp, { verbose: true })} ago)`)
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

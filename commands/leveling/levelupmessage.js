const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "levelupmessage",
  category: "Leveling",
  description: "Toggle level up message, or manage it.",
  aliases: ["lvlupmsg"],
  usage: "<toggle - channel - message - embed>",
  examples: "g!levelupmessage toggle\ng!levelupmessage channel #levellogs\ng!levelupmessage message {{user}} has leveled up to {{level}}! Congrats :tada:\ng!levelupmessage embed",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        if (!args[0]) {
          let rewardmessageEmbed = new Discord.MessageEmbed()
          .setAuthor(`${message.guild.name}'s Level Up Message Options`, message.guild.iconURL())
          .setDescription(`You can edit any setting with the phrase next to it in parentheses. Example: \`g!levelupmessage channel #logs\``)
          .addField("Level Up", `**Send Level Up Message**(toggle) -> \`${guild.settings.leveling.levelup.send}\`
          **Level Up Message Channel**(channel) -> ${guild.settings.leveling.levelup.channel == "default" ? "`current channel`" : `<#${guild.settings.leveling.levelup.channel}>`}
          **Level Up Message**(message) -> \`${guild.settings.leveling.levelup.message}\`
          **Is Level Up Message a Embed?**(embed) -> \`${guild.settings.leveling.levelup.embed}\``)
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
          .setColor("GOLD")
          message.channel.send(rewardmessageEmbed)
        } else if (args[0].toLowerCase() == "toggle") {
          if (guild.settings.leveling.levelup.send) {
            guild.settings.leveling.levelup.send = false
          } else {
            guild.settings.leveling.levelup.send = true
          }
          guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Level up message has been toggled to \`${guild.settings.leveling.levelup.send}\``)).catch(err => message.channel.send("An error occured: " + err))
        } else if (args[0].toLowerCase() == "channel") {
          if (!args[1]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a channel, or provide `default` to set it to current channel.")
          if (!message.mentions.channels.first() && args[1].toLowerCase() != "default") return message.channel.send("<:cross:724049024943915209> | You didn't provide a true channel, or provide `default` to set it to current channel.");
          guild.settings.leveling.levelup.channel = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1].toLowerCase()
          guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Level up messages now will be sent to ${guild.settings.leveling.levelup.channel == "default" ? "the current channel" : `<#${guild.settings.leveling.levelup.channel}>`}.`)).catch(err => message.channel.send("An error occured: " + err))
        } else if (args[0].toLowerCase() == "message") {
          if (!args[1]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a message. Here are some quotes you can use to customize your level up message: \n`{{user}}` -> User mention, `{{tag}}` -> User tag, `{{username}}` -> Username, `{{level}}` -> Current level, `{{xp}}` -> Current xp")
          args.shift()
          guild.settings.leveling.levelup.message = args.join(" ")
          guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Level up message has been set to your message successfully!`)).catch(err => message.channel.send("An error occured: " + err))
        } else if (args[0].toLowerCase() == "embed") {
          if (guild.settings.leveling.levelup.embed) {
            guild.settings.leveling.levelup.embed = false
          } else {
            guild.settings.leveling.levelup.embed = true
          }
          guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Level up message embed has been toggled to \`${guild.settings.leveling.levelup.send}\`, if enabled messages will be sent in a embed.`)).catch(err => message.channel.send("An error occured: " + err))
        } else {
          return message.channel.send("<:cross:724049024943915209> | You didn't provide a true option, `toggle, channel, message, embed`");
        }
      }
    })
  }
};

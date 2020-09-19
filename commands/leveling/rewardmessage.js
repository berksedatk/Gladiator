
const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "rewardmessage",
  category: "Leveling",
  description: "Manage level and xp reward messages",
  aliases: ["rewardmsg"],
  usage: "[<level - xp> <toggle - channel - message - embed>]",
  examples: "g!levelupmessage\ng!levelupmessage level toggle\ng!levelupmessage xp channel #rewardlogs\ng!levelupmessage level message {{user}} has leveled up to {{level}} and got rewarded with {{role}}! Congrats :tada:\ng!levelupmessage xp embed",
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
          .setAuthor(`${message.guild.name}'s Reward Message Options`, message.guild.iconURL())
          .setDescription(`You can edit any setting with the phrase next to it in parentheses. Example: \`g!rewardmessage level channel #logs\``)
          .addField("Xp", `**Send Xp Reward Message**(toggle) -> \`${guild.settings.leveling.reward.xp.send}\`
          **Xp Reward Message Channel**(channel) -> ${guild.settings.leveling.reward.xp.channel == "default" ? "`current channel`" : `<#${guild.settings.leveling.reward.xp.channel}>`}
          **Xp Reward Message**(message) -> \`${guild.settings.leveling.reward.xp.message}\`
          **Is Xp Reward Message a Embed?**(embed) -> \`${guild.settings.leveling.reward.xp.embed}\``)
          .addField("Level", `**Send Level Reward Message**(toggle) -> \`${guild.settings.leveling.reward.level.send}\`
          **Level Reward Message Channel**(channel) -> ${guild.settings.leveling.reward.level.channel == "default" ? "`current channel`" : `<#${guild.settings.leveling.reward.level.channel}>`}
          **Level Reward Message(message)** -> \`${guild.settings.leveling.reward.level.message}\`
          **Is Level Reward Message a Embed?**(embed) -> \`${guild.settings.leveling.reward.level.embed}\``)
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
          .setColor("GOLD")
          message.channel.send(rewardmessageEmbed)
        } else if (args[0].toLowerCase() == "xp") {
          if (args[1].toLowerCase() == "toggle") {
            if (guild.settings.leveling.reward.xp.send) {
              guild.settings.leveling.reward.xp.send = false
            } else {
              guild.settings.leveling.reward.xp.send = true
            }
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Xp reward message has been toggled to \`${guild.settings.leveling.reward.xp.send}\``)).catch(err => message.channel.send("An error occured: " + err))
          } else if (args[1].toLowerCase() == "channel") {
            if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a channel, or provide `default` to set it to current channel.")
            if (!message.mentions.channels.first() && args[2].toLowerCase() != "default") return message.channel.send("<:cross:724049024943915209> | You didn't provide a true channel, or provide `default` to set it to current channel.");
            guild.settings.leveling.reward.xp.channel = message.mentions.channels.first() ? message.mentions.channels.first().id : args[2].toLowerCase()
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Xp reward messages now will be sent to ${guild.settings.leveling.reward.xp.channel == "default" ? "the current channel" : `<#${guild.settings.leveling.reward.xp.channel}>`}.`)).catch(err => message.channel.send("An error occured: " + err))
          } else if (args[1].toLowerCase() == "message") {
            if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a message. Here are some quotes you can use to customize your xp reward message: \n`{{user}}` -> User mention, `{{tag}}` -> User tag, `{{username}}` -> Username, `{{level}}` -> Current level, `{{role}} -> Reward role`")
            args.shift()
            guild.settings.leveling.reward.xp.message = args.join(" ")
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Xp reward message has been set to your message successfully!`)).catch(err => message.channel.send("An error occured: " + err))
          } else if (args[1].toLowerCase() == "embed") {
            if (guild.settings.leveling.reward.xp.embed) {
              guild.settings.leveling.reward.xp.embed = false
            } else {
              guild.settings.leveling.reward.xp.embed = true
            }
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Xp reward message embed has been toggled to \`${guild.settings.leveling.reward.xp.send}\`, if enabled messages will be sent in a embed.\n**Warning** If you don't want the role to be pinged please make embed true or take the {{role}} parameter out the message. You have been warned.`)).catch(err => message.channel.send("An error occured: " + err))
          } else {
            return message.channel.send("<:cross:724049024943915209> | You didn't provide a true option, `toggle, channel, message, embed`");
          }
        } else if (args[0].toLowerCase() == "level") {
          if (args[1].toLowerCase() == "toggle") {
            if (guild.settings.leveling.reward.level.send) {
              guild.settings.leveling.reward.level.send = false
            } else {
              guild.settings.leveling.reward.level.send = true
            }
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Level reward message has been toggled to \`${guild.settings.leveling.reward.level.send}\``)).catch(err => message.channel.send("An error occured: " + err))
          } else if (args[1].toLowerCase() == "channel") {
            if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a channel, or provide `default` to set it to current channel.")
            if (!message.mentions.channels.first() && args[2].toLowerCase() != "default") return message.channel.send("<:cross:724049024943915209> | You didn't provide a true channel, or provide `default` to set it to current channel.");
            guild.settings.leveling.reward.level.channel = message.mentions.channels.first() ? message.mentions.channels.first().id : args[2].toLowerCase()
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Level reward messages now will be sent to ${guild.settings.leveling.reward.level.channel == "default" ? "the current channel" : `<#${guild.settings.leveling.reward.level.channel}>`}.`)).catch(err => message.channel.send("An error occured: " + err))
          } else if (args[1].toLowerCase() == "message") {
            if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a message. Here are some quotes you can use to customize your level reward message: \n`{{user}}` -> User mention, `{{tag}}` -> User tag, `{{username}}` -> Username, `{{xp}}` -> Current xp, `{{role}} -> Reward role`")
            args.shift()
            guild.settings.leveling.reward.level.message = args.join(" ")
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Level reward message has been set to your message successfully!`)).catch(err => message.channel.send("An error occured: " + err))
          } else if (args[1].toLowerCase() == "embed") {
            if (guild.settings.leveling.reward.level.embed) {
              guild.settings.leveling.reward.level.embed = false
            } else {
              guild.settings.leveling.reward.level.embed = true
            }
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Level reward message embed has been toggled to \`${guild.settings.leveling.reward.level.send}\`, if enabled messages will be sent in a embed.\n**Warning** If you don't want the role to be pinged please make embed true or take the {{role}} parameter out the message. You have been warned.`)).catch(err => message.channel.send("An error occured: " + err))
          } else {
            return message.channel.send("<:cross:724049024943915209> | You didn't provide a true option, `toggle, channel, message, embed`");
          }
        } else {

        }

      }
    })
  }
};

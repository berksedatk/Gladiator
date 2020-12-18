const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "welcomemessage",
  category: "Moderation",
  description: "Gives the newcomers a welcome message.",
  aliases: ["welcomemsg"],
  usage: "[message - channel - toggle]",
  cooldown: 5,
  reqPermissions: ['MANAGE_GUILD'],
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        if (!args[0]) {
          let welcomeEmbed = new Discord.MessageEmbed()
          .setTitle(`${message.guild.name}'s Welcome Message Options`)
          .setDescription("You can edit any setting with the phrase next to it in parentheses. Example: g!welcomemessage message Hi {{user}}! Welcome to {{server}}, with you we have {{count}} members!")
          .setColor("PURPLE")
          .setTimestamp()
          .addField("Welcome Message Options", `Welcome Message Enabled(toggle) -> \`${guild.settings.join.message.text.enabled}\`
Welcome Message Channel(channel) -> ${guild.settings.join.message.channel == "default" ? `System Channel(${message.guild.systemChannel})` : `<#${guild.settings.join.message.channel}>`}
Welcome Message(message) -> \`${guild.settings.join.message.text.message}\``)
          .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
          message.channel.send(welcomeEmbed)
        } else if (args[0].toLowerCase() == "toggle") {
          if (guild.settings.join.message.text.enabled) {
            guild.settings.join.message.text.enabled = false
          } else {
            guild.settings.join.message.text.enabled = true
          }
          guild.save().then(() => message.success(`Sending welcome message has been toggled to \`${guild.settings.join.message.text.enabled}\``)).catch(err => message.channel.send("An error occured: " + err))
        } else if (args[0].toLowerCase() == "channel") {
          if (!args[1]) return message.error("You didn't provide a channel, or provide `default` to set it to the system channel(if theres a one).", true, "channel <channel - default>")
          if (!message.mentions.channels.first() && args[1].toLowerCase() != "default") return message.error("You didn't provide a true channel, or provide `default` to set it to current channel.", true, "channel <channel - default>");
          if (args[1].toLowerCase() == "default" && !message.guild.systemChannel) return message.error("This server does not have a System Messages channel set.")
          guild.settings.join.message.channel = message.mentions.channels.first() ? message.mentions.channels.first().id : args[1].toLowerCase()
          guild.save().then(() => message.success(`Welcome messages now will be sent to ${guild.settings.join.message.channel == "default" ? "the current channel" : `<#${guild.settings.join.message.channel}>`}.`)).catch(err => message.channel.send("An error occured: " + err))
        } else if (args[0].toLowerCase() == "message") {
          if (!args[1]) return message.error("You didn't provide a message. Here are some quotes you can use to customize your welcome message: \n`{{user}}` -> User mention, `{{tag}}` -> User tag, `{{username}}` -> Username, `{{server}}` -> Server Name, `{{count}}` -> Member count", true, "message <message>")
          args.shift()
          guild.settings.join.message.text.message = args.join(" ")
          guild.save().then(() => message.success(`Welcome message has been set to your message successfully!`)).catch(err => message.channel.send("An error occured: " + err))
        } else {
          return message.error("You didn't provide a true option, `message, channel, toggle`", true, this.usage)
        }
      }
    })
  }
};

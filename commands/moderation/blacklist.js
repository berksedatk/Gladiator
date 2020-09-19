const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const find = require("../../find.js");

module.exports = {
  name: "blacklist",
  category: "Moderation",
  description: "Blacklist a channel or a command to be used.",
  usage: "<channel - command>",
  cooldown: 5,
  guildOnle: true,
  reqPermissions: ['MANAGE_GUILD'],
  execute(bot, message, args) {
    if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a option, `channel, command`");
    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
      if (guild) {
        if (args[0].toLowerCase() == "channel") {
          if (!args[1]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a channel.")
          let channel = await find.channel(bot, message, args[1])
          if (!channel) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true channel.")

          if (guild.settings.blacklist.channels.includes(channel.id)) {
            for (var i = guild.settings.blacklist.channels.length - 1; i >= 0; i--) {
              if (guild.settings.blacklist.channels[i] === channel.id) {
                guild.settings.blacklist.channels.splice(i, 1);
              }
            }
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | ${channel} has been removed from blacklist.`)).catch(err => message.channel.send("An error occured: " + err))
          } else {
            guild.settings.blacklist.channels.push(channel.id)
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | ${channel} has been blacklisted from bot commands.`)).catch(err => message.channel.send("An error occured: " + err))
          }
        } else if (args[0].toLowerCase() == "command") {
          if (!args[1]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a command.")
          let command = bot.commands.get(args[1].toLowerCase())
          if (!command) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true command.");

          if (guild.settings.blacklist.commands.includes(command.name)) {
            for (var i = guild.settings.blacklist.commands.length - 1; i >= 0; i--) {
              if (guild.settings.blacklist.commands[i] === command.name) {
                guild.settings.blacklist.commands.splice(i, 1);
              }
            }
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | \`${command.name}\` has been removed from server blacklist.`)).catch(err => message.channel.send("An error occured: " + err))
          } else {
            guild.settings.blacklist.commands.push(command.name)
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | \`${command.name}\` has been blacklisted from the whole server.`)).catch(err => message.channel.send("An error occured: " + err))
          }
        } else {
          return message.channel.send("<:cross:724049024943915209> | You didn't provide a true option, `channel, command`")
        }
      }
    })
  }
};

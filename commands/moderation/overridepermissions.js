const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "overridepermissions",
  category: "Moderation",
  description: "Override command permissions for users, roles or channels",
  aliases: ["op"],
  usage: "<command> <deny - allow | cooldown> <user - role - channel>",
  examples: "g!op 8ball deny @Sax#6211\ng!op channelinfo allow #botcommands\ng!op help @BaddieRole",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  execute(bot, message, args) {
    if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a command to override permissions.");
    if (!bot.commands.get(args[0].toLowerCase())) return message.channel.send("<:cross:724049024943915209> | This command doesn't exist.")
    if (!args[1]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a option, `deny, allow, cooldown`")

    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        if (args[1].toLowerCase() == "deny") {
          if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You didn't mention a user, role or a channel to deny the permissions to.");
          if (message.mentions.users.first()) {
            let array = [args[0].toLowerCase()]
            array = array.concat(guild.overridePermissions.denied.users.get(message.mentions.users.first().id))
            guild.overridePermissions.denied.users.set(message.mentions.users.first().id, array)
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | User has been denied from using the \`${args[0].toLowerCase()}\` command.`)).catch(err => message.channel.send(`An error occured: ${err}`))
          } else if (message.mentions.roles.first()) {
            guild.overridePermissions.denied.roles.set(message.mentions.roles.first().id, [args[0].toLowerCase()])
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | The role has been denied from using the \`${args[0].toLowerCase()}\` command.`)).catch(err => message.channel.send(`An error occured: ${err}`))
          } else if (message.mentions.channels.first()) {
            guild.overridePermissions.denied.channels.set(message.mentions.channels.first().id, [args[0].toLowerCase()])
            guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | The channel has been denied from using the \`${args[0].toLowerCase()}\` command.`)).catch(err => message.channel.send(`An error occured: ${err}`))
          } else {
            return message.channel.send("<:cross:724049024943915209> | You didn't mention a true user, role or a channel to deny the permissions to.")
          }
        } else if (args[1].toLowerCase() == "allow") {
          if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You didn't mention a user, role or a channel to deny the permissions to.");
          if (message.mentions.users.first()) {
            let array = []
            if (guild.overridePermissions.denied.users.get(message.mentions.users.first().id)) {
              if (guild.overridePermissions.denied.users.get(message.mentions.users.first().id).includes(args[0].toLowerCase())) {
                array = array.concat(guild.overridePermissions.denied.users.get(message.mentions.users.first().id))
                for (var i = array.length - 1; i >= 0; i--) {
                  if (array[i] === args[0].toLowerCase()) {
                    array.splice(i, 1);
                  }
                }
                guild.overridePermissions.denied.users.set(message.mentions.users.first().id, array)
                guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | User is now allowed to use the \`${args[0].toLowerCase()}\` command.`)).catch(err => message.channel.send(`An error occured: ${err}`))
              } else {
                return message.channel.send("<:cross:724049024943915209> | This user isnt denied for this command.");
              }
            } else {
              return message.channel.send("<:cross:724049024943915209> | This user isnt denied for this command.");
            }
          } else if (message.mentions.roles.first()) {
            if (guild.overridePermissions.denied.roles.get(message.mentions.roles.first().id)) {
              if (guild.overridePermissions.denied.roles.get(message.mentions.roles.first().id).includes(args[0].toLowerCase())) {
                let array = []
                array = array.concat(guild.overridePermissions.denied.roles.get(message.mentions.roles.first().id))
                for (var i = array.length - 1; i >= 0; i--) {
                  if (array[i] === args[0].toLowerCase()) {
                    array.splice(i, 1);
                  }
                }
                guild.overridePermissions.denied.roles.set(message.mentions.roles.first().id, array)
                guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Role is now allowed to use the \`${args[0].toLowerCase()}\` command.`)).catch(err => message.channel.send(`An error occured: ${err}`))
              } else {
                return message.channel.send("<:cross:724049024943915209> | This role isnt denied for this command.");
              }
            } else {
              return message.channel.send("<:cross:724049024943915209> | This role isnt denied for this command.");
            }
          } else if (message.mentions.channels.first()) {
            if (guild.overridePermissions.denied.channels.get(message.mentions.channels.first().id)) {
              if (guild.overridePermissions.denied.channels.get(message.mentions.channels.first().id).includes(args[0].toLowerCase())) {
                let array = []
                array = array.concat(guild.overridePermissions.denied.channels.get(message.mentions.channels.first().id))
                for (var i = array.length - 1; i >= 0; i--) {
                  if (array[i] === args[0].toLowerCase()) {
                    array.splice(i, 1);
                  }
                }
                guild.overridePermissions.denied.channels.set(message.mentions.channels.first().id, array)
                guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Role is now allowed to use the \`${args[0].toLowerCase()}\` command.`)).catch(err => message.channel.send(`An error occured: ${err}`))
              } else {
                return message.channel.send("<:cross:724049024943915209> | This role isnt denied for this command.");
              }
            } else {
              return message.channel.send("<:cross:724049024943915209> | This role isnt denied for this command.");
            }
          } else {
            return message.channel.send("<:cross:724049024943915209> | You didn't mention a true user, role or a channel to deny the permissions to.")
          }
        } else if (args[1].toLowerCase() == "cooldown") {
          if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You didn't provide the cooldown to set to command.");
          if (args[2] < 0) return message.channel.send("<:cross:724049024943915209> | Cooldown cannot be negative.");
          guild.overridePermissions.cooldown.set(args[0].toLowerCase(), Number(args[2]))
          guild.save().then(() => message.channel.send(`<:tick:724048990626381925> | Command cooldown for \`${args[0].toLowerCase()}\` command has been set to \`${args[2]}\` seconds.`)).catch(err => message.channel.send(`An error occured: ${err}`))
        }
      }
    })
  }
};

const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const find = require("../../utility/find.js");

module.exports = {
  name: "autorole",
  category: "Settings",
  description: "Adds a role to users or bots upon join",
  usage: "<add - remove - toggle - list> <user - bot> <role>",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  botPermissions: ["MANAGE_ROLES"],
  execute(bot, message, args) {
    if (!args[0]) return message.error("You didn't provide a option, `add, remove, toggle, list`", true, this.usage);
    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.channel.send("An error occured: " + err);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
      if (guild) {
        if (args[0].toLowerCase() == "add") {
          if (!args[1]) return message.error("You didn't provide a option, `user, bot`", true, "add <user - bot> <role>")
          if (args[1].toLowerCase() == "user") {
            if (!args[2]) return message.error("You didn't provide a role to add.", true ,"add user <role>")
            let role = await find.role(bot, message, args[2])
            if (!role) return message.error("You didn't provide a true role.");
            if (guild.settings.join.autorole.userroles.includes(role.id)) return message.error("This role is already in autorole.");
            let array = [role.id]
            array = array.concat(guild.settings.join.autorole.userroles)
            guild.settings.join.autorole.userroles = array
            guild.save().then(() => message.success("User Autorole has been set for the role.")).catch(err => message.channel.send("An error occured: " + err))
          } else if (args[1].toLowerCase() == "bot") {
            if (!args[2]) return message.error("You didn't provide a role to add.", true, "add bot <role>")
            let role = await find.role(bot, message, args[2])
            if (!role) return message.error("You didn't provide a true role.");
            if (guild.settings.join.autorole.botroles.includes(role.id)) return message.error("This role is already in autorole.");
            let array = [role.id]
            array = array.concat(guild.settings.join.autorole.botroles)
            guild.settings.join.autorole.botroles = array
            guild.save().then(() => message.success("Bot Autorole has been set for the role.")).catch(err => message.channel.send("An error occured: " + err))
          } else {
            return message.error("You didn't provide a true option, `user, bot`", true ,"add <user - bot> <role>");
          }
        } else if (args[0].toLowerCase() == "remove") {
          if (!args[1]) return message.error("You didn't provide a option, `user, bot`", true ,"remove <user - bot> <role>")
          if (args[1].toLowerCase() == "user") {
            if (!args[2]) return message.error("You didn't provide a role to remove.", true, "remove user <role>")
            let role = await find.role(bot, message, args[2])
            if (!role) return message.error("You didn't provide a true role.");
            if (!guild.settings.join.autorole.userroles.includes(role.id)) return message.error("This role is not in autorole.");
            let array = guild.settings.join.autorole.userroles
            for (var i = array.length - 1; i >= 0; i--) {
              if (array[i] === role.id) {
                array.splice(i, 1);
              }
            }
            guild.settings.join.autorole.userroles = array
            guild.save().then(() => message.success("User Autorole has been removed for the role.")).catch(err => message.channel.send("An error occured: " + err))
          } else if (args[1].toLowerCase() == "bot") {
            if (!args[2]) return message.error("You didn't provide a role to remove.", true ,"remove bot <role>")
            let role = await find.role(bot, message, args[2])
            if (!role) return message.error("You didn't provide a true role.", true ,"remove bot <role>");
            if (!guild.settings.join.autorole.botroles.includes(role.id)) return message.error("This role is not in autorole.");
            let array = guild.settings.join.autorole.botroles
            for (var i = array.length - 1; i >= 0; i--) {
              if (array[i] === role.id) {
                array.splice(i, 1);
              }
            }
            guild.settings.join.autorole.botroles = array
            guild.save().then(() => message.success("Bot Autorole has been removed for the role.")).catch(err => message.channel.send("An error occured: " + err))
          } else {
            return message.error("You didn't provide a true option, `user, bot`", true, "remove <user - bot> <role>");
          }
        } else if (args[0].toLowerCase() == "toggle") {
          if (guild.settings.join.autorole.enabled) {
            guild.settings.join.autorole.enabled = false
          } else {
            guild.settings.join.autorole.enabled = true
          }
          guild.save().then(() => message.success(`Autorole has been toggled to \`${guild.settings.join.autorole.enabled}\``)).catch(err => message.channel.send("An error occured: " + err))
        } else if (args[0].toLowerCase() == "list") {
          let botroles = [];
          guild.settings.join.autorole.botroles.forEach(r => botroles.push(`<@&${r}>`))
          let userroles = [];
          guild.settings.join.autorole.userroles.forEach(r => userroles.push(`<@&${r}>`))
          console.log(userroles)

          let autoroleEmbed = new Discord.MessageEmbed()
          .setTitle(`⚙️ Autorole for ${message.guild.name}`)
          .setDescription(`Add a autorole by using \`${message.prefix}autorole add <bot - user> <role>\` command. Toggle autorole by using \`${message.prefix}autorole toggle\` command.`)
          .setTimestamp()
          .setColor("PURPLE")
          .addField("Enabled", `\`${guild.settings.join.autorole.enabled}\``)
          .addField("User Roles", userroles.join(", ").length > 0 ? userroles.join(", ") : "No User Autoroles", true)
          .addField("Bot Roles", botroles.join(", ").length > 0 ? botroles.join(", ") : "No Bot Autoroles", true)
          message.channel.send(autoroleEmbed)
        } else {
          return message.error("You didn't provide a true option, `add, remove, toggle, list`", true, this.usage);
        }
      }
    })
  }
};

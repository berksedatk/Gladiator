const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  name: "leveledroles",
  category: "Leveling",
  description: "Manage level or xp roles.",
  aliases: ["lr"],
  usage: "[level | xp]",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  async execute(bot, message, args) {
     await Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        if (!args[0]) {
          return message.channel.send(":x: | You didn't provide a option. `level, xp`");
        } else if (args[0].toLowerCase() === "level") {
          if (!args[1]) {
            //Check the level roles
            let levelmsg = []
            levelmsg.push(`To add new leveled level roles, use \`g!leveledroles level add <level> <role>\` command.\n\n**Level - Role**`)
            guild.levelroles.forEach((role, level) => {
              levelmsg.push(`\`${level}\` -> <@&${role}>`)
            })

            if (levelmsg.length < 1) levelmsg.push("None")

            const levelembed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor("#bc93ed")
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
            .setTitle("Leveled Level Roles List")
            .setDescription(levelmsg)
            message.channel.send(levelembed)
          } else if (args[1].toLowerCase() === "add") {
            //Add level roles
            if (!args[2]) return message.channel.send(":x: | You need to provide a level to add a role onto. Usage `g!leveledroles level add <level> <role>`");
            if (args[2] > 100 || args[2] < 1) return message.channel.send(":x: | I do not suggest you to use levels that are higher than 100 and below 1. Sorry.");

            let role = message.mentions.roles.first() ? message.mentions.roles.first()
              : (message.guild.roles.cache.get(args[3]) ? message.guild.roles.cache.get(args[3])
              : (message.guild.roles.cache.filter(role => role.name.includes(args[3])).size >= 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[3])).array()
              : null))

            if (role === null) return message.channel.send(":x: | You didn't provide a true role.");

            if (role.length > 1) {
              let rolemsg = "";
              for (let i = 0; i < role.length; i++) {
                rolemsg += `\n${i + 1} - ${role[i]}`
              }

              let msg = await message.channel.send("", {embed: {description: `**There are multiple roles found with name '${args[0]}', which one would you like to use?** \n${rolemsg}`, footer: {text: "You have 30 seconds to respond."}, timestamp: Date.now()}});
              let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 15000, max: 1 })
              if (!collected.first()) return message.channel.send(":x: | Command timed out.");
              if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
              role = role[collected.first().content - 1]
              msg.delete()
            } else {
              role = role[0] || role
            }

            if (guild.levelroles.get(args[2])) {
              if (guild.levelroles.get(args[2]) === role.id) return message.channel.send(":x: | This role is already set up for this level.");
            } else {
              guild.levelroles.set(args[2], role.id)
            }

            await guild.save().then(() => message.channel.send({embed: {description: `:white_check_mark: | ${role} has been set for level \`${args[2]}\` as a leveled role.`}})).catch(err => message.channel.send(`An error occured: ${err}`))

          } else if (args[1].toLowerCase() === "remove") {
            //Remove level roles
            let level = (args[2] <= 100 && args[2] > 0) ? args[2] : false
            if (!level) return message.channel.send(":x: | You need to provide a level.");

            let role = guild.levelroles.get(level)

            if (!role) return message.channel.send(":x: | This level does not have any roles set.");

            guild.levelroles.set(level, undefined)
            await guild.save().then(() => message.channel.send({embed: {description: `:white_check_mark: | <@&${role}> has been removed from the level \`${level}\`.`}})).catch(err => message.channel.send(`An error occured: ${err}`))

          } else {
            return message.channel.send(":x: | You didn't provide a true option. `add, remove`");
          }
        } else if (args[0].toLowerCase() === "xp") {
          //Xp roles
          if (!args[1]) {
            //Show all xp roles
            let xpmsg = []
            xpmsg.push(`To add new leveled xp roles, use \`g!xpedroles xp add <xp> <role>\` command.\n\n**Xp - Role**`)
            guild.xproles.forEach((role, xp) => {
              xpmsg.push(`\`${xp}\` -> <@&${role}>`)
            })

            if (xpmsg.length < 1) xpmsg.push("None")

            const xpembed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor("#bc93ed")
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
            .setTitle("Leveled Xp Roles List")
            .setDescription(xpmsg)
            message.channel.send(xpembed)
          } else if (args[1].toLowerCase() === "add") {
            //Add xp roles
            if (!args[2]) return message.channel.send(":x: | You need to provide a xp to add a role onto. Usage `g!leveledroles xp add <xp> <role>`");
            if (args[2] <= 100) return message.channel.send(":x: | I do not suggest you to use xp that is under 100. Sorry.");

            let role = message.mentions.roles.first() ? message.mentions.roles.first()
              : (message.guild.roles.cache.get(args[3]) ? message.guild.roles.cache.get(args[3])
              : (message.guild.roles.cache.filter(role => role.name.includes(args[3])).size >= 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[3])).array()
              : null))

            if (role === null) return message.channel.send(":x: | You didn't provide a true role.");

            if (role.length > 1) {
              let rolemsg = "";
              for (let i = 0; i < role.length; i++) {
                rolemsg += `\n${i + 1} - ${role[i]}`
              }

              let msg = await message.channel.send("", {embed: {description: `**There are multiple roles found with name '${args[0]}', which one would you like to use?** \n${rolemsg}`, footer: {text: "You have 30 seconds to respond."}, timestamp: Date.now()}});
              let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 15000, max: 1 })
              if (!collected.first()) return message.channel.send(":x: | Command timed out.");
              if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
              role = role[collected.first().content - 1]
              msg.delete()
            } else {
              role = role[0] || role
            }

            if (guild.xproles.get(args[2])) {
              if (guild.xproles.get(args[2]) === role.id) return message.channel.send(":x: | This role is already set up for this xp.");
            } else {
              guild.xproles.set(args[2], role.id)
            }

            await guild.save().then(() => message.channel.send({embed: {description: `:white_check_mark: | ${role} has been set for \`${args[2]}xp\` as a xp role.`}})).catch(err => message.channel.send(`An error occured: ${err}`))

          } else if (args[1].toLowerCase() === "remove") {
            //Remove xp roles
            let xp = Number(args[2]) ? args[2] : false
            if (!xp) return message.channel.send(":x: | You need to provide a xp.");

            let role = guild.xproles.get(xp)
            if (!role) return message.channel.send(":x: | This xp does not have any roles set.");

            guild.xproles.set(xp, undefined)
            await guild.save().then(() => message.channel.send({embed: {description: `:white_check_mark: | <@&${role}> has been removed from the \`${xp}xp\`.`}})).catch(err => message.channel.send(`An error occured: ${err}`))

          } else {
            return message.channel.send(":x: | You didn't provide a true option. `add, remove`");
          }
        } else {
          //Error
          return message.channel.send(":x: | You didn't provide a true option. `level, xp`");
        }
      }
    });
  }
};

const Discord = require("discord.js");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");
const prefixes = require("../config.json").prefixes

module.exports = {
  name: "settings",
  category: "Moderation",
  description: "Settings of your server.",
  usage: "[join/levelup/blacklist]",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  execute(bot, message, args) {
    let prefix = false;
    for (const thisPrefix of prefixes) {
      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
    }
    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
      if (guild) {
        if (!args[0]) {
          //Send current settings
          let join = `\`${prefix}settings join <setting>\``
          let levelup = `\`${prefix}settings levelup <setting>\``
          let blacklist = `\`${prefix}settings blacklist <setting>\``
          
          join += `\n **- Send Join Message(send):** \`${guild.settings.join.send}\``
          join += `\n **- Join Message Channel(channel):** ${guild.settings.join.channel === "default" ? "`default`": `<#${guild.settings.join.channel}>`}`
          join += `\n **- Join Message(message):** "User, ${guild.settings.join.message}"`
          join += `\n **- Autorole(autorole):** \`${guild.settings.join.autorole}\``
          join += `\n **- Join Autorole(role):** ${guild.settings.join.role === null ? "`no role`" : `<@&${guild.settings.join.role}>`}`
          join += `\n **- Bot Autorole(botrole):** ${guild.settings.join.botrole === null ? "`no role`" : `<@&${guild.settings.join.botrole}>`}`
          
          levelup += `\n **- Send Level Up Message(send):** \`${guild.settings.levelup.send}\``
          levelup += `\n **- Level Up Message Channel(channel):** ${guild.settings.levelup.channel === "default" ? "`default`" : `<#${guild.settings.levelup.channel}>`}`
          
          let channels = "";
          if (!guild.settings.blacklist.list[0]) {
            channels = "None"
          } else {
            guild.settings.blacklist.list.forEach(channel => {
              channels += `<#${channel}> `
            })
          }
          
          blacklist += `\n **- Blacklist(enabled):** \`${guild.settings.blacklist.enabled}\``
          blacklist += `\n **- Blacklisted Channel(s)(add/remove):** ${channels}`
          
          const settingsEmbed = new Discord.MessageEmbed()
          .setTitle(":wrench: Current Server Settings")
          .setDescription(`You can get into a category and change the setting by using \`${prefix}settings <category> <setting>\` command.`)
          .setColor("PURPLE")
          .setTimestamp()
          .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
          .addField("Join Options", join)
          .addField("Level Up Options", levelup)
          .addField("Blacklist Options", blacklist)
          message.channel.send(settingsEmbed)
        } else if (args[0].toLowerCase() === "join") {
          //Join options
          if (!args[1]) {
            //Error
            message.channel.send(":x: | You need to provide a setting. `send, channel, message, autorole`");
          } else if (args[1].toLowerCase() === "send") {
            //Update send
            if (!args[2]) return message.channel.send(":x: | You didnt provide a option. `true, false`");
            if (!args[2] === "true" || !args[2] === "false") return message.channel.send(":x: | You didnt provide a true option. `true, false`");
            if ((args[2] === "true") === guild.settings.join.send) return message.channel.send(`:x: | It's already set to \`${guild.settings.join.send}\`.`);
            
            guild.settings.join.send = (args[2] === "true")
            guild.save().then(() => message.channel.send(`:white_check_mark: | Send Join Message has been set to \`${(args[2] === "true")}\`.`)).catch(err => message.channel.send(`An error occured: ${err}`));
            
          } else if (args[1].toLowerCase() === "channel") {
            //Update channel
            if (!args[2]) return message.channel.send(":x: | You didnt provide a channel.");
            
            let channel = message.mentions.channels.first() ? message.mentions.channels.first().id
            : (message.guild.channels.cache.get(args[2]) ? message.guild.channels.cache.get(args[2]).id
            : (args[2].toLowerCase() === "default" ? "default" 
            : null))
            if (channel === null) return message.channel.send(":x: | You didnt provide a true channel.");
            if (channel === "default") {
              guild.settings.join.channel = channel
              guild.save().then(() => message.channel.send(`:white_check_mark: | Join Message Channel has been set to the System Messages Channel.`)).catch(err => message.channel.send(`An error occured: ${err}`));
            } else {
              guild.settings.join.channel = channel
              guild.save().then(() => message.channel.send(`:white_check_mark: | Join Message Channel has been set to <#${channel}>.`)).catch(err => message.channel.send(`An error occured: ${err}`));
            }
          } else if (args[1].toLowerCase() === "message") {
            //Update message
            if (!args[2]) return message.channel.send(":x: | You didnt provide a message, to disable it you can use `send` setting.");
            const quote = args.slice(2, args.length)
            
            guild.settings.join.message = quote.join(" ")
            guild.save().then(() => message.channel.send(`:white_check_mark: | Join Message has been set to "User, ${quote.join(" ")}"`)).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[1].toLowerCase() === "autorole") {
            //Autorole enable-disable
            if (!args[2]) return message.channel.send(":x: | You didnt provide a option. `true, false`");
            if ((args[2] === "true") === guild.settings.join.autorole) return message.channel.send(`:x: | It's already set to \`${guild.settings.join.autorole}\`.`);
            
            guild.settings.join.autorole = (args[2] === "true")
            guild.save().then(() => message.channel.send(`:white_check_mark: | Join Autorole has been set to \`${(args[2] === "true")}\`.`)).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[1].toLowerCase() === "role") {
            //Autorole 
            if (!args[2]) return message.channel.send(":x: | You didnt provide a role");
            let role = message.mentions.roles.first() ? message.mentions.roles.first()
              : (message.guild.roles.cache.get(args[2]) ? message.guild.roles.cache.get(args[2])
              : (message.guild.roles.cache.filter(role => role.name.includes(args[2])).size >= 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[2])).array()
              : null))
      
            if (role === null) return message.channel.send(":x: | You didn't provide a true role.");
            if (role.length > 1) {
              let rolemsg = "";
              for (let i = 0; i < role.length; i++) {
                rolemsg += `\n${i + 1} - ${role[i].name}`
              }
              message.channel.send(`There are multiple roles found with name '${args[2]}', which one would you like to use? ${rolemsg}`)
              await message.channel.awaitMessages(m => m.author.id === message.author.id, { time:15000, max: 1, errors:['time'] }).then(collected => {
                if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
                role = role[collected.first().content - 1]
              }).catch(err => {
                return message.channel.send(":x: | Command cancelled.")
              });
            } else {
              role = role[0] || role
            }
            
            if (!role.editable) return message.channel.send(":x: | I can't manage this role. Sorry.");
            if (message.member.roles.highest.position <= message.guild.roles.cache.find(grole => grole.name.toLowerCase() == role.name.toLowerCase()).position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't manage this role.");
            
            guild.settings.join.role = role.id
            guild.save().then(() => message.channel.send({embed: {description: `:white_check_mark: | Autorole has been set to ${role}.`}})).catch(err => message.channel.send(`An error occured: ${err}`));
          } else if (args[1].toLowerCase() === "botrole") {
            //Autorole 
            if (!args[2]) return message.channel.send(":x: | You didnt provide a role");
            let role = message.mentions.roles.first() ? message.mentions.roles.first()
              : (message.guild.roles.cache.get(args[2]) ? message.guild.roles.cache.get(args[2])
              : (message.guild.roles.cache.filter(role => role.name.includes(args[2])).size >= 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[2])).array()
              : null))
      
            if (role === null) return message.channel.send(":x: | You didn't provide a true role.");
            if (role.length > 1) {
              let rolemsg = "";
              for (let i = 0; i < role.length; i++) {
                rolemsg += `\n${i + 1} - ${role[i].name}`
              }
              message.channel.send(`There are multiple roles found with name '${args[2]}', which one would you like to use? ${rolemsg}`)
              await message.channel.awaitMessages(m => m.author.id === message.author.id, { time:15000, max: 1, errors:['time'] }).then(collected => {
                if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
                role = role[collected.first().content - 1]
              }).catch(err => {
                return message.channel.send(":x: | Command cancelled.")
              });
            } else {
              role = role[0] || role
            }
            
            if (!role.editable) return message.channel.send(":x: | I can't manage this role. Sorry.");
            if (message.member.roles.highest.position <= message.guild.roles.cache.find(grole => grole.name.toLowerCase() == role.name.toLowerCase()).position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't manage this role.");
            
            guild.settings.join.botrole = role.id
            guild.save().then(() => message.channel.send({embed: {description:`:white_check_mark: | Bot Autorole has been set to ${role}.`}})).catch(err => message.channel.send(`An error occured: ${err}`));
          } else {
            //Error
            message.channel.send(":x: | You need to provide a true setting. `send, channel, message, autorole`");
          }
        } else if (args[0].toLowerCase() === "levelup") {
          //Level up options
          if (!args[1]) {
            //Error
            message.channel.send(":x: | You need to provide a setting. `send, channel`");
          } else if (args[1].toLowerCase() === "send") {
            //Update send
            if (!args[2]) return message.channel.send(":x: | You didnt provide a option. `true, false`");
            if (!args[2] === "true" || !args[2] === "false") return message.channel.send(":x: | You didnt provide a true option. `true, false`");
            if ((args[2] === "true") === guild.settings.levelup.send) return message.channel.send(`:x: | It's already set to \`${guild.settings.levelup.send}\`.`);
            
            guild.settings.levelup.send = (args[2] === "true")
            guild.save().then(() => message.channel.send(`:white_check_mark: | Send Level Up Message has been set to \`${(args[2] === "true")}\`.`)).catch(err => message.channel.send(`An error occured: ${err}`));

            if (!args[2]) return message.channel.send(":x: | You didnt provide a option. `true, false`");
            
          } else if (args[1].toLowerCase() === "channel") {
            //Update channel
            if (!args[2]) return message.channel.send(":x: | You didnt provide a channel.");
            let channel = message.mentions.channels.first() ? message.mentions.channels.first().id
              : (message.guild.channels.cache.get(args[2]) ? message.guild.channels.cache.get(args[2]).id
              : (args[2].toLowerCase() === "default" ? "default"
              : null ))
            if (channel === null) return message.channel.send(":x: | You didnt provide a true channel or type `default`.");
            
            if (channel === "default") {
              guild.settings.levelup.channel = "default"
              guild.save().then(() => message.channel.send(`:white_check_mark: | Level Up Message Channel has been set to current channel that the user on.`)).catch(err => message.channel.send(`An error occured: ${err}`));

            } else {
              guild.settings.levelup.channel = channel
              guild.save().then(() => message.channel.send(`:white_check_mark: | Level Up Message Channel has been set to <#${channel}>.`)).catch(err => message.channel.send(`An error occured: ${err}`));
            } 
          } else {
            //Error
            message.channel.send(":x: | You need to provide a true setting. `send, channel`");
          }       
        } else if (args[0].toLowerCase() === "blacklist") {
          //Blacklist options
          if (!args[1]) {
            //Error
            message.channel.send(":x: | You need to provide a setting. `enabled, add, remove`");
            
          } else if (args[1].toLowerCase() === "enabled") {
            //Enable - Disable blacklisting
            if (!args[2]) return message.channel.send(":x: | You didnt provide a option. `true, false`");
            if (!args[2] === "true" || !args[2] === "false") return message.channel.send(":x: | You didnt provide a true option. `true, false`");
            if ((args[2] === "true") === guild.settings.blacklist.send) return message.channel.send(`:x: | It's already set to \`${guild.settings.blacklist.send}\`.`);
            
            guild.settings.blacklist.enabled = (args[2] === "true")
            guild.save().then(() => message.channel.send(`:white_check_mark: | Blacklisting has been set to \`${(args[2] === "true")}\`.`)).catch(err => message.channel.send(`An error occured: ${err}`));
            
          } else if (args[1].toLowerCase() === "add") {
            //Add a blacklisted channel
            if (!args[2]) return message.channel.send(":x: | You didnt provide a channel.");
            let channel = message.mentions.channels.first() ? message.mentions.channels.first()
              : (message.guild.channels.cache.get(args[0]) ? message.guild.channels.cache.get(args[0])
              : (message.guild.channels.cache.filter(channel => channel.name.includes(args[0])).size >= 1 ? message.guild.channels.cache.filter(channel => channel.name.includes(args[0])).array()
              : null))
      
            if (channel === null) return message.channel.send(":x: | You didn't provide a true channel.");
            guild.settings.blacklist.list.push(channel.id)
            guild.save().then(() => message.channel.send(`:white_check_mark: | ${channel} has been added to the blacklisted channels.`)).catch(err => message.channel.send(`An error occured: ${err}`));

          } else if (args[1].toLowerCase() === "remove") {
            //Remove a blacklisted channel
            if (!args[2]) return message.channel.send(":x: | You didnt provide a channel or `all` to remove all.");
            if (args[2].toLowerCase() === "all") {
              //remove all
              guild.settings.blacklist.list = []
              guild.save().then(() => message.channel.send(`:white_check_mark: | All blacklisted channels have ben removed from the list.`)).catch(err => message.channel.send(`An error occured: ${err}`));
            } else {
              //remove chosoen channel
              let channel = message.mentions.channels.first() ? message.mentions.channels.first()
              : (message.guild.channels.cache.get(args[0]) ? message.guild.channels.cache.get(args[0])
              : (message.guild.channels.cache.filter(channel => channel.name.includes(args[0])).size >= 1 ? message.guild.channels.cache.filter(channel => channel.name.includes(args[0])).array()
              : null))
      
              if (channel === null) return message.channel.send(":x: | You didn't provide a true channel.");
              if (guild.settings.blacklist.list.indexOf(channel.id) === -1) {
                return message.channel.send(":x: | This channel is not blacklisted.")
              } else {
                guild.settings.blacklist.list.splice(guild.settings.blacklist.list.indexOf(channel.id), 1)
                guild.save().then(() => message.channel.send(`:white_check_mark: | ${channel} has been removed from the blacklisted channels.`)).catch(err => message.channel.send(`An error occured: ${err}`));
              }
            }          
          } else {
            //Error
            message.channel.send(":x: | You need to provide a true setting. `send, channel`");
          }
        } else {
          //Error
          return message.channel.send(":x: | You didn't provide a true category. `join, levelup, blacklist`")
        }
      }
    });
  }
};
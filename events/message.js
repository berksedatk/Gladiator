const fs = require("fs");
const config = require('../config.json');

const Discord = require("discord.js");
const cooldowns = new Discord.Collection();

const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

function prettyString(string) {
 return string.replace(/_/g, " ").replace(/guild/gi, "Server").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
}

function factorial(num) {
  if (num === 0) {
    return 0;
} if (num === 1)
    return 1;
  for (var i = num - 1; i >= 1; i--) {
    num += i;
  }
  return num;
}

module.exports = {
  async execute(bot, message, db) {
    let blacklisted = false;
    if (message.author.bot || config.blacklisted.includes(message.guild.id)) return;
    //Database
    if (message.content.length < 500 && message.content.length > 10 && message.channel.type != "dm") {
      Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
        if (err) return console.log(`An error occured: ${err}`);
        if (!guild) {
          const guild = new Guild({
            _id: mongoose.Types.ObjectId(),
            guildName: message.guild.name,
            guildID: message.guild.id,
            blacklisted: false,
            settings: {
              join: {
                role: null,
                botrole: null,
                autorole: false,
                channel: "default",
                message: "Welcome to my server!",
                send: false
              },
              levelup: {
                message: "default",
                channel: "default",
                send: true
              },
              blacklist: {
                list: [],
                enabled: false
              },
            },
            cases: {},
            members: {},
            levelroles: {},
            xproles: {},
            reactionroles: {}
          });
          guild.save().then(() => console.log(`Database could not be found so added a new one for ${message.guild.name}`)).catch(err => message.channel.send("New Guild cannot be added to the database! " + err));
        } else if (guild) {
          //Blacklist
          if (guild.settings.blacklist.enabled && guild.settings.blacklist.list.includes(message.channel.id)) return blacklisted = true;

          //XP
          const xp = Math.floor(Math.random() * 100) + 1;
          if (guild.members.get(message.author.id)) {
            const member = guild.members.get(message.author.id)
            //Giving xp
            if ((message.createdTimestamp - member.lastxpmessage) > 30000) {

              //Amount
              let rawxp = member.xp + xp;
              const multiplier = 560 * (member.level + 1);

              //Xp reward
              if (guild.xproles.size > 0) {

                const lastxp = member.xp + factorial(member.level) * 560

                let xproles = []
                guild.xproles.forEach((role, xp) => {
                  xproles.push({role: role, xp: xp})
                })

                xproles.sort((a, b) => b.xp - a.xp)

                while (xproles.length != 0) {
                  if (xproles[0].xp < lastxp) {
                    //Add xp role
                    const xprole = xproles.shift()

                    let xpmessage = `${message.author} You reached \`${xprole.xp}\` xp and you have been rewarded with <@&${xprole.role}> role!`

                    if (!message.guild.members.cache.get(message.author.id).roles.cache.has(xprole.role)) {

                      message.guild.members.cache.get(message.author.id).roles.add(xprole.role).then(() => {
                        if (guild.settings.levelup.send) {
                          guild.settings.levelup.channel === "default" ? message.channel.send({embed: {description: xpmessage }}) : bot.channels.cache.get(guild.settings.levelup.channel).send({embed: {description: xpmessage }});
                        }
                      }).catch(() => {
                        return message.channel.send(`Could not reward the user because role with the id ${xprole.role} was removed from the server, please contract a server manager to remove the xp role from list via \`g!leveledroles xp remove ${xprole.xp}\` command.`)
                      })

                    }

                    break;
                  } else {
                    xproles.shift()
                  }
                }

              }

              //Level up
              if (rawxp > multiplier) {
              let levelupmessage = `${message.author} You leveled up! Now you're level ${member.level + 1}`;
               
                let levelroles = []
                
                guild.levelroles.forEach((role, level) => {
                  levelroles.push({role: role, lvl: level})
                })

                levelroles.sort((a, b) => b.lvl - a.lvl)
                
                while (levelroles.length != 0) {
                  console.log(levelroles[0].lvl)
                  if (levelroles[0].lvl <= member.level) {
                    //Add xp role
                    const lvlrole = levelroles.shift()
                    
                    if (!message.guild.members.cache.get(message.author.id).roles.cache.has(lvlrole.role)) {
                      
                      message.guild.members.cache.get(message.author.id).roles.add(lvlrole.role).then(() => {
                       levelupmessage += `\nYou have been rewarded with the role <@&${guild.levelroles.get(lvlrole.role)}>!`;
                      }).catch(() => {
                        levelupmessage += `Could not reward the user because role with the id ${lvlrole.role} was removed from the server or bot does not have permission to add the user the role, if the role was removed please contract a server manager to remove the xp role from list via \`g!leveledroles xp remove ${lvlrole.xp}\` command.`
                      })

                    }

                    break;
                  } else {
                    levelroles.shift()
                  }
                 }

                //Sending message
                if (guild.settings.levelup.send) {
                  guild.settings.levelup.channel === "default" ? message.reply({embed: {description: levelupmessage }}) : bot.channels.cache.get(guild.settings.levelup.channel).send(`${message.author}`,{embed: {description: levelupmessage }});
                }

                guild.members.set(message.author.id, {
                  username: message.author.tag,
                  id: message.author.id,
                  xp: 0,
                  level: member.level + 1,
                  lastxpmessage: message.createdTimestamp,
                  color: member.color,
                  mode: member.mode
                });
                guild.save().catch(err => message.channel.send(`An error occured: ${err}`));
              } else {
                guild.members.set(message.author.id, {
                  username: message.author.tag,
                  id: message.author.id,
                  xp: rawxp,
                  level: member.level,
                  lastxpmessage: message.createdTimestamp,
                  color: member.color,
                  mode: member.mode
                })
                guild.save().catch(err => message.channel.send(`An error occured: ${err}`));
              }
            }
          } else {
            guild.members.set(message.author.id, {
              username: message.author.tag,
              id: message.author.id,
              xp: xp,
              level: 0,
              lastxpmessage: message.createdTimestamp,
              color: "lightblue",
              mode: "dark"
            });
            guild.save().catch(err => message.channel.send(`An error occured: ${err}`));
          }
        }
      });
    }

    if (blacklisted === true) return;

    //Command
    //Prefix
    const prefixes = config.prefixes;
    let prefix = false;
    for (const thisPrefix of prefixes) {
      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
    }
    if (!prefix || message.author.bot) return;

    //Arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    //Command defining
    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.dev && !config.devs.includes(message.author.id)) {
    return message.channel.send(":x: | You are not accesed to use this command!")
    }
    if (command.guildOnly && message.channel.type === 'dm') {
      return message.reply(':x: | This command cannot be executed in direct messages.');
    }
    if (command.reqPermissions) {
      let missing = []
      command.reqPermissions.forEach(permission => {
        if (!message.guild.members.cache.get(message.author.id).permissions.has(permission)) missing.push(prettyString(permission))
      })
      if (missing.length > 0) {
        return message.channel.send(":x: | You don't have the required permission(s) to use this command!! Missing permission(s): " + missing.join(', '));
      }
    }

    //Cooldowns
    if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime && !config.devs.includes(message.author.id)) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }

    //Executing
    try {
      command.execute(bot, message, args, db);
    } catch (err) {
      console.error(`Executing command error: ${err}`);
      message.channel.send(`Executing command error: ${err}`);
    }
  }
}

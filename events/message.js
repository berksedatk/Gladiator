const { prefixes, devs } = require('../config.json');

const Guild = require('../schemas/guild.js');

const Discord = require("discord.js");
const cooldowns = new Discord.Collection();

function prettyString(string) {
 return string.replace(/_/g, " ").replace(/guild/gi, "Server").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
}

function combine(num) {
  if (num < 0) return -1;
  else if (num == 0) return 0;
  else return (num + combine(num - 1));
}

function lvl(num) {
 num = Math.floor(num / 560);
 for (level = 0; num >= combine(level +1); level++);
 return level;
}

module.exports = async (client, message) => {
  if (!client.ready || message.author.bot) return;

  message.options = await {
    overridePermissions: {
      denied: {
        users: new Map(),
        roles: new Map(),
        channels: new Map()
      },
      allowed: {
        users: new Map(),
        roles: new Map(),
        channels: new Map()
      },
      cooldown: new Map()
    },
    blacklist: {
      commands: [],
      channels: []
    }
  }

  if (message.channel.type == "text" || message.channel.type == "news") {
    if (message.guild.settings && !message.guild.settings.blacklist.channels.includes(message.channel.id) && !message.guild.blacklisted) {
      //Message options
      message.options.overridePermissions = message.guild.overridePermissions
      message.options.blacklist = {
        commands: message.guild.settings.blacklist.commands,
        channels: message.guild.settings.blacklist.channels
      }
      //Leveling
      let leveling = message.guild.settings.leveling
      if (leveling.options.filter.minLength < message.content.length && leveling.options.filter.maxLength > message.content.length && !message.guild.settings.blacklist.channels.includes(message.channel.id)) {
        await Guild.findOne({ guildID: message.guild.id }, (err, guild) => {

          if (err) return console.log("message: Leveling Database Fetch - An error occured: " + err);
          if (!guild) require("../utility/addguild.js")(message.guild);

          if (guild.members.get(message.author.id)) {
            let member = guild.members.get(message.author.id)

            if ((message.createdTimestamp - member.lastxpmessage) > leveling.options.delay * 1000) {
              //New
              let xp = Number(member.xp)
              let level = Number(lvl(xp, (leveling.options.cap || 560)))
              let lvlup = (level + 1) * (leveling.options.cap || 560)
              xp += Math.floor(Math.random() * (leveling.options.xp.max - leveling.options.xp.min) + leveling.options.xp.min)

              //Xp Rewards
              if (leveling.roles.xp.size > 0) {
                let xproles = []
                leveling.roles.xp.forEach((role, xp) => {
                  xproles.push({role: role, xp: xp})
                })

                xproles.sort((a, b) => b.xp - a.xp)

                while (xproles.length != 0) {
                  if (xproles[0].xp < xp) {
                    const xprole = xproles.shift()
                    if (!message.member.roles.cache.has(xprole.role)) {
                      message.member.roles.add(xprole.role).then(() => {

                        let replaceList = [
                          {
                            replace: "{{user}}",
                            with: message.author
                          }, {
                            replace: "{{tag}}",
                            with: message.author.tag
                          }, {
                            replace: "{{username}}",
                            with: message.author.username
                          }, {
                            replace: "{{xp}}",
                            with: xprole.xp
                          }, {
                            replace: "{{userxp}}",
                            with: xp
                          }, {
                            replace: "{{role}}",
                            with: `<@&${xprole.role}>`
                          }
                        ]

                        let rewardmessage = leveling.reward.xp.message
                        replaceList.forEach(s => {
                          rewardmessage = rewardmessage.replace(s.replace, s.with)
                        });

                        if (leveling.reward.xp.embed) {
                          let rewardEmbed = new Discord.MessageEmbed()
                          .setDescription(rewardmessage)
                          if (leveling.reward.xp.channel === "default") {
                            message.channel.send(rewardEmbed)
                          } else {
                            client.channels.cache.get(leveling.reward.xp.channel).send(rewardEmbed)
                          }
                        } else {
                          if (guild.settings.leveling.reward.xp.channel === "default") {
                            message.channel.send(rewardmessage)
                          } else {
                            client.channels.cache.get(leveling.reward.xp.channel).send(rewardmessage)
                          }
                        }
                      }).catch(err => {
                        if (leveling.reward.xp.channel === "default") {
                          message.channel.send({embed: {description: `${message.author} could not reward the user with role <@&${xprole.role}> because it's either deleted, I can't access the role or I can't manage roles. Here is the error: ${err}`}});
                        } else {
                          client.channels.cache.get(leveling.reward.xp.channel).send({embed: {description: `${message.author} could not reward the user with role <@&${xprole.role}> because it's either deleted, I can't access the role or I can't manage roles.Here is the error: ${err}`}});
                        }
                      });
                    }
                    break;
                  } else {
                    xproles.shift()
                  }
                }
              }

              //Levelup
              if (level + 2 > member.level - 1 && xp - (combine(level) * 560) >= lvlup) {

                let replaceList = [
                  {
                    replace: "{{user}}",
                    with: message.author
                  }, {
                    replace: "{{tag}}",
                    with: message.author.tag
                  }, {
                    replace: "{{username}}",
                    with: message.author.username
                  }, {
                    replace: "{{level}}",
                    with: level + 1
                  }, {
                    replace: "{{xp}}",
                    with: xp
                  }
                ]

                let levelupmessage = leveling.levelup.message
                replaceList.forEach(s => {
                  levelupmessage = levelupmessage.replace(s.replace, s.with)
                });

                //Message
                if (leveling.levelup.send) {
                  if (leveling.levelup.embed) {
                    let lvlupEmbed = new Discord.MessageEmbed()
                    .setDescription(levelupmessage)
                    if (leveling.levelup.channel === "default") {
                      message.channel.send(lvlupEmbed)
                    } else {
                      client.channels.cache.get(leveling.levelup.channel).send(lvlupEmbed)
                    }
                  } else {
                    if (leveling.levelup.channel === "default") {
                      message.channel.send(levelupmessage)
                    } else {
                      client.channels.cache.get(leveling.levelup.channel).send(levelupmessage)
                    }
                  }
                }

                //Rewarding
                let levelroles = []

                leveling.roles.level.forEach((role, level) => {
                  levelroles.push({role: role, lvl: level})
                })

                levelroles.sort((a, b) => b.lvl - a.lvl)

                while (levelroles.length != 0) {
                  if (levelroles[0].lvl <= level + 1) {
                    const lvlrole = levelroles.shift()
                    if (!message.member.roles.cache.has(lvlrole.role)) {
                      message.member.roles.add(lvlrole.role).then(() => {
                        replaceList = [
                          {
                            replace: "{{user}}",
                            with: message.author
                          }, {
                            replace: "{{tag}}",
                            with: message.author.tag
                          }, {
                            replace: "{{username}}",
                            with: message.author.username
                          }, {
                            replace: "{{level}}",
                            with: level + 1
                          }, {
                            replace: "{{role}}",
                            with: `<@&${lvlrole.role}>`
                          }
                        ]

                        let rewardmessage = leveling.reward.level.message
                        replaceList.forEach(s => {
                          rewardmessage = rewardmessage.replace(s.replace, s.with)
                        });

                        if (leveling.reward.level.embed) {
                          let rewardEmbed = new Discord.MessageEmbed()
                          .setDescription(rewardmessage)
                          if (leveling.reward.level.channel === "default") {
                            message.channel.send(rewardEmbed)
                          } else {
                            client.channels.cache.get(leveling.reward.level.channel).send(rewardEmbed)
                          }
                        } else {
                          if (leveling.reward.level.channel === "default") {
                            message.channel.send(rewardmessage)
                          } else {
                            client.channels.cache.get(leveling.reward.level.channel).send(rewardmessage)
                          }
                        }
                      }).catch(() => {
                        if (leveling.reward.level.channel === "default") {
                          message.channel.send({embed: {description: `${message.author} could not reward the user with role <@&${lvlrole.role}> because it's either deleted, I can't access the role or I can't manage roles.`}});
                        } else {
                          client.channels.cache.get(leveling.reward.level.channel).send({embed: {description: `${message.author} could not reward the user with role <@&${lvlrole.role}> because it's either deleted, I can't access the role or I can't manage roles.`}});
                        }
                      });
                    }
                    break;
                  }   else {
                    levelroles.shift()
                  }
                }
              }

              guild.members.set(message.author.id, {
                username: message.author.tag,
                id: message.author.id,
                xp: xp,
                level: level + 1,
                color: member.color,
                lastxpmessage: message.createdTimestamp
              })

              guild.save().catch(err => message.channel.send(`message: Saving User Profile - An error occured: ${err}`));

            }
          } else {
            guild.members.set(message.author.id, {
              username: message.author.tag,
              id: message.author.id,
              xp: "0",
              level: "0",
              color: "#add8e6",
              lastxpmessage: message.createdTimestamp
            })
            guild.save().catch(err => message.channel.send(`message: Saving User Profile - An error occured: ${err}`));
          }
        });
      }
    }
  }

  for (const thisPrefix of prefixes) {
    if (message.content.toLowerCase().startsWith(thisPrefix)) message.prefix = thisPrefix;
  }

  if (!message.prefix || message.author.bot || !message.content.toLowerCase().startsWith(message.prefix)) return;

  //Arguments
  const args = message.content.slice(message.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  //Commands definition
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  //Blacklist
  if (message.options.blacklist.commands.includes(command.name)) return message.channel.send("<:cross:724049024943915209> | This command has been blacklisted.")
  if (message.options.blacklist.channels.includes(message.channel.id)) return message.channel.send("<:cross:724049024943915209> | This channel has been blacklisted.")

  //Parameters
  if (command.dev && !devs.includes(message.author.id)) return message.channel.send("<:cross:724049024943915209> | Only Bot Developers can use this command!");
  if (command.guildOnly && message.channel.type == "dm") return message.channel.send("<:cross:724049024943915209> | This command can only be executed in a server!")
  if (command.dmOnly && message.channel.type != "dm") return message.channel.send("<:cross:724049024943915209> | This command can only be executed in DM's!");

  //Permissions
  if (command.reqPermissions && !devs.includes(message.author.id)) {
    if (message.options.overridePermissions) {
      if (message.options.overridePermissions.allowed.users.get(message.author.id)) {
        if (!message.options.overridePermissions.allowed.users.get(message.author.id).includes(command.name)) {
          let missing = [];
          command.reqPermissions.forEach(permission => {
            if (!message.guild.members.cache.get(message.author.id).permissions.has(permission)) missing.push(prettyString(permission))
          })
          if (missing.length > 0) return message.channel.send("<:cross:724049024943915209> | You don't have the required permission(s) to use this command! Missing permission(s): " + missing.join(', '));
        }
      } else {
        let missing = [];
        command.reqPermissions.forEach(permission => {
          if (!message.guild.members.cache.get(message.author.id).permissions.has(permission)) missing.push(prettyString(permission))
        })
        if (missing.length > 0) return message.channel.send("<:cross:724049024943915209> | You don't have the required permission(s) to use this command! Missing permission(s): " + missing.join(', '));
      }
    } else {
      let missing = [];
      command.reqPermissions.forEach(permission => {
        if (!message.guild.members.cache.get(message.author.id).permissions.has(permission)) missing.push(prettyString(permission))
      })
      if (missing.length > 0) return message.channel.send("<:cross:724049024943915209> | You don't have the required permission(s) to use this command! Missing permission(s): " + missing.join(', '));
    }
  }

  if (command.botPermissions) {
    let missing = [];
    command.botPermissions.forEach(perm => {
      if (!message.guild.me.permissions.has(perm)) missing.push(prettyString(perm))
    })
    if (missing.length > 0) return message.channel.send("<:cross:724049024943915209> | I don't have the required permission(s) to execute theis command! Missing permission(s): " + missing.join(', '));
  }

  //Override Permissions
  if (message.options.overridePermissions.denied.users.get(message.author.id)) {
    if (message.options.overridePermissions.denied.users.get(message.author.id).includes(command.name)) return message.channel.send(`<:cross:724049024943915209> | You are not permitted to use \`${command.name}\` command.`);
  }
  if (message.options.overridePermissions.denied.channels.get(message.channel.id)) {
    if (message.options.overridePermissions.denied.channels.get(message.channel.id).includes(command.name)) return message.channel.send(`<:cross:724049024943915209> | You cannot use the \`${command.name}\` command in this channel.`);
  }
  if (message.guild) {
    let roles = []
    message.member.roles.cache.forEach(role => {
      if (message.options.overridePermissions.denied.roles.get(role.id)) {
        if (message.options.overridePermissions.denied.roles.get(role.id).includes(command.name)) roles.push(role.name)
      }
    });
    if (roles.length > 0) return message.channel.send(`<:cross:724049024943915209> | You cannot use the \`${command.name}\` command with these role(s): ${roles.join(", ")}`);
  }

  //Override Cooldown
  if (message.options.overridePermissions.cooldown.get(command.name)) {
    command.cooldown = message.options.overridePermissions.cooldown.get(command.name)
  }

  //Cooldown
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
    if (now < expirationTime && !devs.includes(message.author.id)) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }

  try {
    message.error = function(error, embed, usage) {
      if (!error) throw new ReferenceError("Error context is not defined");
      if (embed) return this.channel.send({embed: {description: `<:cross:724049024943915209> | ${error}${usage ? `\n\nUsage:\n\`${this.prefix}${command.name} ${usage}\`` : ""}`}});
      else return this.channel.send(`<:cross:724049024943915209> | ${error}${usage ? `\n\nUsage:\n\`${this.prefix}${command.name} ${usage}\`` : ""}`)
    }
    message.success = function(success, embed) {
      if (!success) throw new ReferenceError("Success context is not defined");
      if (embed) return this.channel.send({embed: {description: `<:tick:724048990626381925> | ${success}`}});
      else return this.channel.send(`<:tick:724048990626381925> | ${success}`)
    }
    command.execute(client, message, args);
  } catch (err) {
    console.error(`message: Executing command error: ${command.name} - ${err}`);
    message.channel.send(`Executing command error: ${command.name} - ${err}`);
  }
};

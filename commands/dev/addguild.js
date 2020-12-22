const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js")

module.exports = {
  name: "addguild",
  category: "Dev",
  description: "Adds a guild to the database.",
  dev: true,
  async execute(bot, message, args) {
    if (!args[0]) {
      await Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
        if (err) return message.error("An error occured while adding the guild to database: " + err);
        if (guild) message.error(`This database already exists!`);
        if (!guild) {
          let newGuild = new Guild({
            guildName: message.guild.name,
            guildID: message.guild.id,
            blacklisted: false,
            removed: false,
            members: {},
            cases: {},
            reactionroles: {},
            logging: {},
            overridePermissions: {
              denied: {
                users: {},
                roles: {},
                channels: {}
              },
              allowed: {
                users: {},
                roles: {},
                channels: {}
              },
              cooldown: {}
            },
            settings: {
              join: {
                autorole: {
                  enabled: false,
                  botroles: [],
                  userroles: []
                },
                message: {
                  text: {
                    enabled: false,
                    message: "{{user}} Welcome to my server!"
                  },
                  image: {
                    enabled: false,
                    text: "{{tag}} joined the server, we have {{count}} members now!"
                  },
                  channel: message.guild.systemChannel ? message.guild.systemChannel.id : null
                }
              },
              leveling: {
                roles: {
                  level: {},
                  xp: {}
                },
                levelup: {
                  send: true,
                  embed: false,
                  message: ":tada: {{user}} has leveled up to {{level}}!",
                  channel: "default"
                },
                reward: {
                  xp: {
                    send: true,
                    embed: true,
                    message: "{{user}} reached {{xp}} xp and been rewarded with {{role}}.",
                    channel: "default"
                  },
                  level: {
                    send: true,
                    embed: true,
                    message: "{{user}} reached {{level}} level and been rewarded with {{role}}.",
                    channel: "default"
                  }
                },
                options: {
                  delay: 30,
                  cap: 560,
                  xp: {
                    max: 100,
                    min: 10
                  },
                  filter: {
                    maxLength: 150,
                    minLength: 15,
                    repeative: false
                  }
                }
              },
              blacklist: {
                commands: [],
                channels: []
              }
            }
          });
          message.guild.settings = newGuild.settings
          message.guild.blacklisted = newGuild.blacklisted
          message.guild.overridePermissions = newGuild.overridePermissions
          newGuild.save().then(() => message.success(`A new database guild has been added for ${message.guild.name}`)).catch(err => message.error(`An error occured while adding the database for Guild: ${message.guild.name} - err: ${err}`));
        }
      })
    } else if (args[0]) {
      if (!bot.guilds.cache.get(args[0])) return message.error("This guild does not exist.", false, this.usage)
      let guild = bot.guilds.cache.get(args[0])
      await Guild.findOne({ guildID: guild.id }, (err, dguild) => {
        if (err) return message.error("An error occured while adding the guild to database: " + err);
        if (dguild) message.error(`This database already exists!`);
        if (!guild) {
          let newGuild = new Guild({
            guildName: guild.name,
            guildID: guild.id,
            blacklisted: false,
            removed: false,
            members: {},
            cases: {},
            reactionroles: {},
            logging: {},
            overridePermissions: {
              denied: {
                users: {},
                roles: {},
                channels: {}
              },
              allowed: {
                users: {},
                roles: {},
                channels: {}
              },
              cooldown: {}
            },
            settings: {
              join: {
                autorole: {
                  enabled: false,
                  botroles: [],
                  userroles: []
                },
                message: {
                  text: {
                    enabled: false,
                    message: "{{user}} Welcome to my server!"
                  },
                  image: {
                    enabled: false,
                    text: "{{tag}} joined the server, we have {{count}} members now!"
                  },
                  channel: guild.systemChannel ? guild.systemChannel.id : null
                }
              },
              leveling: {
                roles: {
                  level: {},
                  xp: {}
                },
                levelup: {
                  send: true,
                  embed: false,
                  message: ":tada: {{user}} has leveled up to {{level}}!",
                  channel: "default"
                },
                reward: {
                  xp: {
                    send: true,
                    embed: true,
                    message: "{{user}} reached {{xp}} xp and been rewarded with {{role}}.",
                    channel: "default"
                  },
                  level: {
                    send: true,
                    embed: true,
                    message: "{{user}} reached {{level}} level and been rewarded with {{role}}.",
                    channel: "default"
                  }
                },
                options: {
                  delay: 30,
                  cap: 560,
                  xp: {
                    max: 100,
                    min: 10
                  },
                  filter: {
                    maxLength: 150,
                    minLength: 15,
                    repeative: false
                  }
                }
              },
              blacklist: {
                commands: [],
                channels: []
              }
            }
          });
          message.guild.settings = newGuild.settings
          message.guild.blacklisted = newGuild.blacklisted
          message.guild.overridePermissions = newGuild.overridePermissions
          newGuild.save().then(() => message.success(`A new database guild has been added for ${guild.name}`)).catch(err => message.error(`An error occured while adding the database for Guild: ${guild.name} - err: ${err}`));
        }
      })
    }
  }
};

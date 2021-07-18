const Guild = require("../../schemas/guild.js")
let { servers } = require("../../backup.json")

module.exports = {
  name: "movedb",
  category: "Dev",
  description: "aaa",
  usage: "<test> [test]",
  cooldown: 5,
  dev: true,
  unstaged: true,
  voted: true,
  async execute(bot, message, args) {
    await servers.forEach(server => {
      if (bot.guilds.cache.has(server.guildID)) {
        let guildObject = bot.guilds.cache.has(server.guildID)
        Guild.findOne({guildID: server.guildID}, (err, guild) => {
          if (err) return console.log("error on " + server.guildID);
          if (server.guildID = 264445053596991498) guild.blacklisted = true;
          if (guild) {
            guild.settings = {
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
                  channel: guildObject.systemChannel ? guildObject.systemChannel.id : null
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

            for (const [key, value] of Object.entries(server.members)) {
              if (value.xp > 0) {
                guild.members.set(value.id, {
                  username: value.username,
                  id: value.id,
                  xp: value.xp,
                  level: value.level,
                  color: value.color,
                  lastxpmessage: value.createdTimestamp
                });
              }
            }
            guild.save().then(() => console.log(`${server.guildID} successfully imported.`)).catch(err => message.channel.send(`Error for ${server.guildID} ${err}`));
          }
          if (!guild) {
            let newGuild = new Guild({
              guildName: guildObject.name,
              guildID: guildObject.id,
              blacklisted: false,
              removed: false,
              members: {},
              cases: {},
              reactionroles: {},
              logging: {},
              overridePermissions: {
                denied: {
                  users: new Map(),
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
                    channel: guildObject.systemChannel ? guildObject.systemChannel.id : null
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
            for (const [key, value] of Object.entries(server.members)) {
              if (value.xp > 0) {
                newGuild.members.set(value.id, {
                  username: value.username,
                  id: value.id,
                  xp: value.xp,
                  level: value.level,
                  color: value.color,
                  lastxpmessage: value.createdTimestamp
                });
              }
            }
            newGuild.save().then(() => console.log(`${server.guildID} successfully created and imported.`)).catch(err => message.channel.send(`Error for ${server.guildID} ${err}`));
          }
        })
      }
    })
  }
};

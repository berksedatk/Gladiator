const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "addguild",
  category: "Dev",
  description: "Adds a guild to the database.",
  dev: true,
  async execute(bot, message, args) {
    await Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send("An error occured: " + err);
      if (guild) return message.channel.send("<:cross:724049024943915209> | This guild already exists in the database.");
      if (!guild) {
        let newGuild = new Guild({
          guildName: message.guild.name,
          guildID: message.guild.id,
          blacklisted: false,
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
                channel: message.guild.systemChannel.id || null
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

        newGuild.save().then(() => message.channel.send("<:tick:724048990626381925> | Guild has been added to the database.")).catch(err => message.channel.send("An error occured: " + err));
      }
    })
  }
};

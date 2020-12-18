const Guild = require("../schemas/guild.js");

module.exports = async (guildObject) => {
  await Guild.findOne({ guildID: guildObject.id }, (err, guild) => {
    if (err) return console.log("An error occured while adding the guild to database: " + err);
    if (guild) {
      console.log(`Tried adding a new guild but database was already set: ${guild.id}, attempting to switch removed to false...`);
      guild.removed = false
      guild.save().then(() => console.log(`${guild.id} is back.`)).catch(err => {console.log(`Removed to false - ${guild.id} has been added back but the Database could not be updated: ${err}`)})
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
      guildObject.settings = newGuild.settings
      guildObject.blacklisted = newGuild.blacklisted
      guildObject.overridePermissions = newGuild.overridePermissions
      newGuild.save().then(() => console.log(`A new database guild has been added for ${guildObject.name}`)).catch(err => console.log(`An error occured while adding the database for Guild: ${guildObject.id} - err: ${err}`));
    }
  })
};

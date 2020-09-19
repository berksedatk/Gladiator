const { MessageEmbed } = require('discord.js');
const Guild = require("../schemas/guild.js");

module.exports = (bot, guild) => {

  const serverEmbed = new MessageEmbed()
  .setAuthor(guild.owner.user.tag, guild.owner.user.avatarURL())
  .setTitle("New Server!")
  .setColor("GREEN")
  .setThumbnail(guild.iconURL())
  .setTimestamp()
  .setFooter(`New server count: ${bot.guilds.cache.size}`)
  .setDescription(`Server Name: **${guild.name}**(${guild.id}) \nMember Count: **${guild.members.cache.size}** members.`)
  bot.channels.cache.get("673869397277933653").send(serverEmbed);

  Guild.findOne({ guildID: guild.id }, (err, dbGuild) => {
    if (err) {
      console.log(`New Guild could not be added: ${err}`);
      bot.users.cache.get(guild.owner.id).send("There was an error while creating server settings, please contact a bot dev! (https://discord.gg/tkR2nTf)").catch(err => console.log(err));
    }
    if (dbGuild) return console.log(`Joined a new guild but database was already set. ${guild.name}`);
    if (!dbGuild) {
      const guildschema = new Guild({
        guildName: guild.name,
        guildID: guild.id,
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
              channel: guild.systemChannel.id || null
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
      guildschema.save().then(() => console.log("A new Guild database has been added. " + guild.name)).catch(err => console.log(`A new guild could not be added to the database ${guild.name}, error: ` + err))
    }
  });
}

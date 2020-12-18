const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "removeguild",
  category: "Dev",
  description: "Removes a guild from database.",
  dev: true,
  execute(bot, message, args) {
    if (!args[0]) {
      Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
        if (err) return message.error("An error occured: " + err);
        if (!guild) return message.error("This guild does not have a database.");
        if (guild) {
          guild.remove().then(() => message.success("Guild has been removed from databse.")).catch(err => message.error("Guild could not be removed from database! " + err));
        }
      })
    } else if (args[0]) {
      if (!bot.guilds.cache.get(args[0])) return message.error("This guild does not exist.")
      Guild.findOne({ guildID: args[0] }, (err, guild) => {
        if (err) return message.error("An error occured: " + err);
        if (!guild) return message.error("This guild does not have a database.");
        if (guild) {
          guild.remove().then(() => message.success("Guild has been removed from databse.")).catch(err => message.error("Guild could not be removed from database! " + err));
        }
      })
    }

  }
};

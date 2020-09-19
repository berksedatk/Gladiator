const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "removeguild",
  category: "Dev",
  description: "Removes a guild from database.",
  dev: true,
  execute(bot, message, args) {
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send("An error occured: " + err);
      if (!guild) return message.channel.sendError("<:cross:724049024943915209> | This guild does not have a database.");
      if (guild) {
        guild.remove().then(() => message.channel.send("<:tick:724048990626381925> | Guild has been removed from databse.")).catch(err => message.channel.send("Guild could not be removed from database! " + err));
      }
    })
  }
};

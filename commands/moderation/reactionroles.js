const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");

module.exports = {
  name: "reactionroles",
  category: "Moderation",
  description: "Add or remove reaction roles",
  aliases: ["rr"],
  usage: "<add - remove - list>",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  botPermissions: ["MANAGE_ROLES"],
  execute(bot, message, args) {
    //if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a option, `add, remove, list`")
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        if (args[0].toLowerCase() === "add") {

        }
      }
    });
  }
};

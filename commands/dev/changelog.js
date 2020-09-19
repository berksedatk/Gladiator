const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "changelog",
  description: "Sends a changelog message on <#673869350108659743>",
  usage: "[log]",
  dev: true,
  unstaged: true,
  execute(bot, message, args) {
    const logEmbed = new Discord.MessageEmbed()
      .setTitle("Version: " + config.version)
      .setDescription(args.join(" "))
      .setColor("PURPLE")
      .setTimestamp()
      .setFooter("Created by Sax#6211");

    bot.channels.cache.get(config.channels.changeLogs).send(logEmbed);
    message.delete();
  }
};

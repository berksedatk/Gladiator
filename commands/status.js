const Discord = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: "status",
  category: "General",
  description: "The status of the bot.",
  aliases: ["stats"],
  cooldown: 5,
  async execute(bot, message, args) {
    const msg = await message.channel.send(`Just a moment...`);

    const totalSeconds = process.uptime();
    const realTotalSecs = Math.floor(totalSeconds % 60);
    const days = Math.floor((totalSeconds % 31536000) / 86400);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const mins = Math.floor((totalSeconds / 60) % 60);

    const embed = new Discord.MessageEmbed()
      .setAuthor(bot.user.username, bot.user.avatarURL())
      .setColor("BLUE")
      .setThumbnail(bot.user.avatarURL())
      .addField("Born On", bot.user.createdAt)
      .addField("Current Version", config.version, true)
      .addField("Servers", `${bot.guilds.cache.size} servers`, true)
      .addField("Channels", `${bot.channels.cache.size} channels`, true)
      .addField("Users", `${bot.users.cache.size.toLocaleString()} users`, true)
      .addField("Prefixes", config.prefixes.join(", "))
      .addField("Ping", `Latency \`${msg.createdTimestamp - message.createdTimestamp}ms\``)
      .addField("Uptime", `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds`)
      .setFooter("Created by: Sax#6211")
      .setTimestamp();
    msg.edit("", {embed: embed});
  }
};

const Discord = require("discord.js");
const config = require('../../config.json');
const os = require('os-utils');

module.exports = {
  name: "stats",
  category: "General",
  description: "Shows the stats of the client.",
  cooldown: 5,
  async execute(bot, message, args) {
    const msg = await message.channel.send(`Just a moment...`);

    const totalSeconds = process.uptime();
    const realTotalSecs = Math.floor(totalSeconds % 60);
    const days = Math.floor((totalSeconds % 31536000) / 86400);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const mins = Math.floor((totalSeconds / 60) % 60);

    const memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)

    await os.cpuUsage(async function(v){
      const embed = new Discord.MessageEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL())
        .setColor("BLUE")
        .addField("Born On", bot.user.createdAt)
        .addField("Servers", `${bot.guilds.cache.size.toLocaleString()} servers`, true)
        .addField("Channels", `${bot.channels.cache.size.toLocaleString()} channels`, true)
        .addField("Users", `${bot.users.cache.size.toLocaleString()} users`, true)
        .addField("Current Version", config.version, true)
        .addField("Prefixes", `\`${config.prefixes.join(", ")}\``, true)
        .addField("Ping", `Latency \`${msg.createdTimestamp - message.createdTimestamp}ms\``, true)
        .addField("Resource Usage", `\`\`\`RAM Usage: ${Math.round(memUsage * 100) / 100}/${Math.round(os.totalmem())} MB
Avg. CPU Usage: ${v}%\`\`\``)
        .addField("Uptime", `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds`)
        .setFooter("Created by: Sax#6211")
        .setTimestamp();
      msg.edit("", {embed: embed});
    })
  }
};

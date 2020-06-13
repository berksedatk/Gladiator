const Discord = require('discord.js');

module.exports = {
  name: 'uptime',
  category: "General",
  description: 'Bot\'s uptime.',
  cooldown: 5,
  async execute(bot, message) {
    const msg = await message.channel.send(`Just a moment...`);

    const totalSeconds = process.uptime();
    const realTotalSecs = Math.floor(totalSeconds % 60);
    const days = Math.floor((totalSeconds % 31536000) / 86400);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const mins = Math.floor((totalSeconds / 60) % 60);

    let pingEmbed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setTimestamp()
      .addField(`⏱️ Uptime`, `${days} days, ${hours} hours, ${mins} minutes, and ${realTotalSecs} seconds.`);
    msg.edit("", pingEmbed)
  }
};

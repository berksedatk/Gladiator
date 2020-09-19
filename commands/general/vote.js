const Discord = require("discord.js");

module.exports = {
  name: "vote",
  description: "Vote for the bot on top.gg! You can vote every 12 hours.",
  cooldown: 5,
  execute(bot, message, args) {
    let voteEmbed = new Discord.MessageEmbed()
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .setAuthor(bot.user.username, bot.user.avatarURL())
      .setColor("GREEN")
      .setTimestamp()
      .setDescription("[Click Here To Vote For Bot!](https://discordbots.org/bot/507604696609849355/vote)");
    message.channel.send(voteEmbed);
  }
};

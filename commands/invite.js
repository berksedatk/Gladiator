const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invites for support channel and bot auth.",
  execute(bot, message, args) {
    const inviteEmbed = new MessageEmbed()
    .setDescription("To invite Gladiator to your server click [here](https://gladiatorbot.glitch.me/inviterec). \n\nJoin the support server Sax's Bot Dump by clicking [here](https://discord.gg/PqjP3Dy)")
    .setColor("GOLD")
    .setThumbnail(bot.user.avatarURL())
    .setFooter("Gladiator by Sax#6211")
    .setTimestamp()
    message.channel.send(inviteEmbed)
  }
};

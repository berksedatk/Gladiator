const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite Gladiator to your server or join the support server!",
  execute(bot, message, args) {
    const inviteEmbed = new MessageEmbed()
    .setDescription("To invite Gladiator to your server click [here](https://discord.com/api/oauth2/authorize?client_id=507604696609849355&permissions=431040621687&scope=bot%20applications.commands). \n\nJoin the support server by clicking [here](https://discord.gg/JQZquyU)")
    .setColor("GOLD")
    .setThumbnail(bot.user.avatarURL())
    .setFooter("Gladiator by Sax#6211 and noodle#8720")
    .setTimestamp()
    message.channel.send(inviteEmbed)
  }
};

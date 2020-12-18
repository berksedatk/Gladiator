const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "support",
  category: "General",
  description: "Invite to the support server and view support commands.",
  cooldown: 5,
  execute(bot, message, args) {
    let supportembed = new MessageEmbed()
    .setTitle("Hey, You Need Support?")
    .setDescription("You can reach out to the support server with clicking [here](https://discord.gg/JQZquyU).\nIf you have a bug report, you can report it by using the `g!bugreport` command without joining the support server!\nAny suggestions? Use the `g!suggest` command to suggest your ideas!")
    .setColor("GOLD")
    .setTimestamp()
    .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
    message.channel.send(supportembed)
  }
};

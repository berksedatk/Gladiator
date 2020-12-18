const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "bugreport",
  category: "General",
  description: "Report a bug, please be clear while reporting a bug on the bot, if possible please attach images. Unnecesary reports might cause you to get blacklisted.",
  aliases: ["report"],
  usage: "<description> [attachments]",
  cooldown: 6000,
  execute(bot, message, args) {
    if (!args[0]) return message.error("You didn't provide the description of the bug!", true, this.usage)
    let attachments = []
    message.attachments.forEach(attachment => {
      attachments.push(attachment.url)
    })
    let reportEmbed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle("New Bug Report")
    .setTimestamp()
    .setColor("RED")
    .setDescription(`**Report description:**\n${args.join(" ")}\n**Attachments:**\n${attachments.join('\n')}`)
    bot.channels.cache.get("750413703387545751").send(reportEmbed).then(() => {
      message.success("Your report has been placed and will be reviewed by devs!")
    })
  }
};

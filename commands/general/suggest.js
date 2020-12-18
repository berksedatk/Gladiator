const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "suggest",
  category: "General",
  description: "Suggest a feature to the bot! All of your suggestions will be considered.",
  usage: "<suggestions>",
  cooldown: 60,
  execute(bot, message, args) {
    if (!args[0]) return message.error("You didn't provide a suggestion!", true, this.usage)
    let suggestionEmbed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setTitle("New Suggestion!")
    .setTimestamp()
    .setColor("GREEN")
    .setDescription(args.join(" "))
    bot.channels.cache.get("669543996489465856").send(suggestionEmbed).then(() => {
      message.success("Your suggestion has been placed!")
    })
  }
};

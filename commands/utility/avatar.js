const Discord = require("discord.js");
const find = require("../../utility/find.js");

module.exports = {
  name: "avatar",
  category: "Utility",
  description: "Get a specified user's avatar.",
  aliases: ["av"],
  usage: "[user]",
  cooldown: 5,
  async execute(bot, message, args) {
    let user
    if (!args[0]) {
      user = message.author
    } else {
      user = await find.user(bot, message, args[0])
      if (!user) return message.error("You didn't provide a true user.", true, this.usage)
    }

    message.channel.send({
      embed: {
        description: `Here is **${user.tag}**'s avatar:`,
        image: {
          url: user.avatarURL({format:"png",dynamic:true,size:1024})
        },
        color: "RED",
        footer: {
          text: `Requested by: ${message.author.tag}`,
          icon: message.author.avatarURL()
        }
      }
    })
  }
};

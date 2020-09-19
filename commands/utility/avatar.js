const Discord = require("discord.js");
const find = require("../../find.js");

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
      if (!user) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true user.")
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

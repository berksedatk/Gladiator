const Discord = require("discord.js");

module.exports = {
  name: "embed",
  category: "Utility",
  description: "Creates an embed",
  usage: "[title: - description: - color: - timestamp: - author: - footer: - authorimg: - footerimg: - addfield:title,field - image:]",
  cooldown: 10,
  reqPermissions: ['MANAGE_MESSAGES'],
  execute(bot, message, args) {
    if (!args[0]) {
      return message.channel.send(":x: | You need to provide at least one of these options: \n`title: - description: - color: - timestamp: - author: - footer: - authorimg: - footerimg: - addfield:title,field - image:`")
    } else {
      
    }
  }
};
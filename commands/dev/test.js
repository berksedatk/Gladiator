//This is just a template of a command,
//Replace the name, category, etc. with whatever you want
//Delete the unused properities on module.exports
//Insert your code inside execute command

const Discord = require("discord.js");

module.exports = {
  name: "test",
  category: "Dev",
  description: "Test",
  aliases: ["tests"],
  usage: "<test> [test]",
  cooldown: 5,
  dev: true,
  unstaged: true,
  voted: true,
  reqPermissions: ['MANAGE_GUILD'],
  execute(bot, message, args) {
    message.channel.send("Test");
  }
};

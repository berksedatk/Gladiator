//This is just a template of a command,
//Replace the name, category, etc. with whatever you want
//Delete the unused properities on module.exports
//Insert your code inside execute command

  if (!args[0]) return message.channel.send(":x: | You didn't provided a user.");
    let user = message.mentions.users.first() ? message.mentions.users.first()
      : (message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0])
      : (message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(args[0].toLowerCase())).size > 0 ? message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(args[0].toLowerCase())).array()
      : undefined))
    if (!user) return message.channel.send(":x: | You didn't provide a true user.");

    if (user.length > 1) {
      let usermsg = "";
        for (let i = 0; i < (user.length > 10 ? 10 : user.length); i++) {
      usermsg += `\n${i + 1} -> ${user[i].user.username}`;
      }

      let msg = await message.channel.send("", {embed: {description: `**There are multiple users found with name '${args[0]}', which one would you like to use?** \n${usermsg}`, footer: {text: "You have 30 seconds to respond."}, timestamp: Date.now()}});
      let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] })
      if (Number(collected.first().content) > user.length) return message.channel.send(":x: | Invalid user number. Command cancelled.");
      user = user[collected.first().content - 1]
      msg.delete()
    } else {
      user = user[0] || user
    }

const Discord = require("discord.js");

module.exports = {
  name: "test",
  category: "Utility",
  description: "Test",
  aliases: ["tests"],
  usage: "<test> [test]",
  cooldown: 5,
  dev: true,
  unstaged: true,
  guildOnly: true,
  voted: true,
  reqPermissions: ['MANAGE_GUILD'],
  execute(bot, message, args) {
    message.channel.send("Test");
  }
};

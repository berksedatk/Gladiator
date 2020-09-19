const Discord = require("discord.js");

module.exports = {
  name: "purge",
  category: "Moderation",
  description: "Purges the amount of messages you want(plus your message).",
  aliases: ["prune"],
  usage: "<range> [user - keyword - invites - links - attachments - longerthan:number - shorterthan:number]",
  cooldown: 10,
  guildOnly: true,
  reqPermissions: ["MANAGE_MESSAGES"],
  execute(bot, message, args) {
    const amount = Number(args[0]);
    const user = message.mentions.users ? message.mentions.users.first() : (bot.users.cache.get(args[0]) ? bot.users.cache.get(args[0]) : null)
    if (!args[0] || !amount) return message.channel.send("<:cross:724049024943915209> | You must provide a number between 1 and 100.")
    if (amount >= 101) return message.channel.send("<:cross:724049024943915209> | The range must be between 1 and 100.");

    message.delete().then(() => {
      if (!user && !args[1]) {
      message.channel.bulkDelete(amount).then(messages => {
        message.channel.send(`Done! Cleaned \`${amount}\` messages for you!`).then(msg => msg.delete({timeout: 5000}))
      });
    } else if (user) {
      message.channel.messages.fetch({ limit: 100 }).then(async messages => {
        messages = messages.filter(m => m.author.id === user.id).array().slice(0, amount);
        await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        message.channel.send(`Done! Cleaned \`${amount}\` messages of ${user.username} for you!`).then(msg => msg.delete({timeout: 5000}))
      });
    } else if (args[1].toLowerCase() === "invites") {
      message.channel.messages.fetch({ limit: 100 }).then(async messages => {
        messages = messages.filter(m => /discord\.gg|discordapp\.com|discord\.com/g.test(m.content)).array().slice(0, amount);
        await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        message.channel.send(`Done! Cleaned \`${amount}\` messages that include invites for you!`).then(msg => msg.delete({timeout: 5000}))
      });
    } else if (args[1].toLowerCase() === "links") {
      message.channel.messages.fetch({ limit: 100 }).then(async messages => {
        messages = messages.filter(m => /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g.test(m.content)).array().slice(0, amount);
        await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        message.channel.send(`Done! Cleaned \`${amount}\` messages that include links for you!`).then(msg => msg.delete({timeout: 5000}))
      });
    } else if (args[1].toLowerCase() === "attachments") {
      message.channel.messages.fetch({ limit: 100 }).then(async messages => {
        messages = messages.filter(m => m.attachments.size > 0).array().slice(0, amount);
        await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        message.channel.send(`Done! Cleaned \`${amount}\` messages that include attachments for you!`).then(msg => msg.delete({timeout: 5000}))
      });
    } else if (args[1].toLowerCase().startsWith("longerthan:")) {
      let length = args[1].slice(args[1].indexOf("longerthan:") + 11)
      if (!Number(length)) return message.channel.send(":x: | You have to provide a true number for 'longerthan' option.");
      message.channel.messages.fetch({ limit: 100 }).then(async messages => {
        messages = messages.filter(m => m.content.length > length).array().slice(0, amount);
        await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        message.channel.send(`Done! Cleaned \`${amount}\` messages that is longer than \`${length}\` characters for you!`).then(msg => msg.delete({timeout: 5000}))
      });
    } else if (args[1].toLowerCase().startsWith("shorterthan:")) {
      let length = args[1].slice(args[1].indexOf("shorterthan:") + 12)
      if (!Number(length)) return message.channel.send(":x: | You have to provide a true number for 'longerthan' option.");
      message.channel.messages.fetch({ limit: 100 }).then(async messages => {
        messages = messages.filter(m => m.content.length < length).array().slice(0, amount);
        await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        message.channel.send(`Done! Cleaned \`${amount}\` messages that is shorter than \`${length}\` characters for you!`).then(msg => msg.delete({timeout: 5000}))
      });
    } else if (args[1]) {
      message.channel.messages.fetch({ limit: 100 }).then(async messages => {
        messages = messages.filter(m => m.content.toLowerCase().includes(args[1].toLowerCase())).array().slice(0, amount);
        await message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
        message.channel.send(`Done! Cleaned \`${amount}\` messages that include \`${args[1]}\` for you!`).then(msg => msg.delete({timeout: 5000}))
      });
    }
    })
  }
};

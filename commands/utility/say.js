const Discord = require("discord.js");

module.exports = {
  name: "say",
  category: "Utility",
  description: "Make Gladiator say your favourite quotes.",
  usage: "<quote>",
  cooldown: 5,
  reqPermissions: ["MANAGE_MESSAGES"],
  execute(bot, message, args) {
    if (!args[0]) return message.channel.send("")
    const quote = args.join(" ");
    if (quote.length > 512) return message.error("The quote must be in rage of 1 to 512 characters.");
    message.channel.send(quote).then(() => {
      message.delete({ timeout: 2000, reason: `Quote message` });
    });
  }
};

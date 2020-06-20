const Discord = require("discord.js");

module.exports = {
  name: "say",
  category: "Fun",
  description: "Make Gladiator say your favourite quotes.",
  usage: "<quote>",
  voted: true,
  cooldown: 10,
  execute(bot, message, args) {
    if (!args[0]) return message.channel.send(":x: | You didn't provide a quote.")
    const quote = args.join(" ");
    if (quote.length > 512) return message.channel.send(":x: | The quote must be in rage of 1 to 512 characters.");

    message.channel.send(quote).then(() => {
      message.delete({ timeout: 2500, reason: `Quote message` });
    });
  }
};

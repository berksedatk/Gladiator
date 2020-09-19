const Discord = require("discord.js");

module.exports = {
  name: "flipcoin",
  category: "Fun",
  description: "Flip a coin.",
  aliases: ["fc"],
  usage: "<head(s)/tail(s)>",
  examples: "g!fc head",
  cooldown: 5,
  execute(bot, message, args) {
    const coin = Math.floor(Math.random() * 2);
    if (!args[0]) {
      if (coin === 0) {
        const side = "Heads";
        const color = "RED";
        const response = "The coin dropped on the heads side.";
        flipcoin(coin, color, side, response);
      } else {
        const side = "Tails";
        const color = "BLUE";
        const response = "The coin dropped on the tails side.";
        flipcoin(coin, color, side, response);
      }
    } else if (
      args[0] === "head" ||
      args[0] === "heads" ||
      args[0] === "tail" ||
      args[0] === "tails"
    ) {
      if (coin === 0) {
        const side = "Heads";
        const color = "RED";
        let response = "";
        if (args[0] === "head" || args[0] === "heads") {
          response = "You guessed right!";
        } else {
          response = "You guessed false.";
        }
        flipcoin(coin, color, side, response);
      } else if (coin === 1) {
        const side = "Tails";
        const color = "BLUE";
        let response = "";
        if (args[0] === "tail" || args[0] === "tails") {
          response = "You guessed right!";
        } else {
          response = "You guessed false.";
        }
        flipcoin(coin, color, side, response);
      } else {
        return message.channel.send("An error occured.");
      }
    } else {
      message.channel.send(
        ":x: | Please provide a side, `head, heads, tail, tails`"
      );
    }

    function flipcoin(coin, color, side, response) {
      const coinEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor(color)
        .addField(`**${side}!**`, `${response}`)
        .setFooter(
          "Requested by " + message.author.tag,
          message.author.avatarURL()
        );
      message.channel.send(coinEmbed);
    }
  }
};

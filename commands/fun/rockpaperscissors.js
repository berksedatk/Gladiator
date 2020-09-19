const Discord = require("discord.js");

module.exports = {
  name: "rockpaperscissors",
  category: "Fun",
  description: "A classical rock paper scissors game.",
  aliases: ["rps"],
  usage: "<rock/paper/scissors>",
  examples: "g!rps rock",
  cooldown: 5,
  execute(bot, message, args) {
    let pHand = "";
    const list = ["rock", "paper", "scissors"];

    const hand = list[Math.floor(Math.random() * list.length)];
    if (args[0]) {
      pHand = args[0].toLowerCase();
    }

    function rpsEmbed(pHand, hand, result, quote, color) {
      const rpsEmbed = new Discord.MessageEmbed()
        .setTitle("**Rock! Paper! Scissors!**")
        .setTimestamp()
        .setColor(color)
        .setFooter(
          "Requested by " + message.author.tag,
          message.author.avatarURL()
        )
        .addField(`**${result}**`, quote);
      message.channel.send(rpsEmbed);
    }

    function rps(pHand, hand) {
      if (hand === pHand) {
        const result = "Tie!";
        const quote = "We picked the same thing.";
        const color = "GOLD";
        rpsEmbed(pHand, hand, result, quote, color);
      } else if (hand === "rock" && pHand === "paper") {
        const result = "You won!";
        const quote = `You beated me up. I've choosen **${hand}**.`;
        const color = "GREEN";
        rpsEmbed(pHand, hand, result, quote, color);
      } else if (hand === "rock" && pHand === "scissors") {
        const result = "You lost!";
        const quote = `Haha I won, I've choosen **${hand}**`;
        const color = "RED";
        rpsEmbed(pHand, hand, result, quote, color);
      } else if (hand === "paper" && pHand === "rock") {
        const result = "You lost!";
        const quote = `Haha I won, I've choosen **${hand}**`;
        const color = "RED";
        rpsEmbed(pHand, hand, result, quote, color);
      } else if (hand === "paper" && pHand === "scissors") {
        const result = "You won!";
        const quote = `You beated me up. I've choosen **${hand}**.`;
        const color = "GREEN";
        rpsEmbed(pHand, hand, result, quote, color);
      } else if (hand === "scissors" && pHand === "rock") {
        const result = "You won!";
        const quote = `You beated me up. I've choosen **${hand}**.`;
        const color = "GREEN";
        rpsEmbed(pHand, hand, result, quote, color);
      } else if (hand === "scissors" && pHand === "paper") {
        const result = "You lost!";
        const quote = `Haha I won, I've choosen **${hand}**`;
        const color = "RED";
        rpsEmbed(pHand, hand, result, quote, color);
      }
    }

    if (
      !args.lenght &&
      pHand != "rock" &&
      pHand != "paper" &&
      pHand != "scissors"
    ) {
      message.reply("Please choose something you can play with! The command will expire in 15 seconds. \n`rock, paper or scissors`").then(r => r.delete(15000));
      message.channel.awaitMessages(m => (m.author.id === message.author.id && m.content === "rock") || m.content === "paper" || m.content === "scissors",
          {
            max: 1,
            time: 15000,
            errors: ["time"]
          }
        )
        .then(collected => {
          let pHand = collected.first().content.toLowerCase();
          return rps(pHand, hand);
        })
        .catch(err => {
          return message.channel.send(":x: | Command cancelled.");
        });
    } else {
      rps(pHand, hand);
    }
  }
};

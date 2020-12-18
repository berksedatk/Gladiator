const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "8ball",
  category: "Fun",
  description: "Ask a question to 8ball",
  usage: "<question>",
  examples: "g!8ball Am I going to be rich in future?",
  cooldown: 5,
  execute(bot, message, args) {
    if (!args[0]) return message.error("You have to ask a question to 8ball!", true, this.usage);
    if (args.join(' ').length >= 256 || args.join(' ').length < 1) return message.error("Question must be in range of 1 to 256 characters!");

    const ball = ["As I see it, yes.","Ask again later.","Better not tell you now.","Cannot predict now.","Concentrate and ask again.",
    "Don’t count on it.", "It is certain.","It is decidedly so.","Most likely.","My reply is no.","My sources say no.","Outlook not so good.",
    "Outlook good.","Reply hazy, try again.","Signs point to yes.","Very doubtful.","Without a doubt.","Yes.","Yes – definitely.","You may rely on it."]
    const answer = ball[Math.floor(Math.random() * ball.length)]

    let ballEmbed = new MessageEmbed()
    .setTimestamp()
    .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
    .setTitle(args.slice().join(" "))
    .setDescription(answer)
    .setColor("GOLD")

    message.channel.send(ballEmbed);
  }
};

const Discord = require("discord.js");

module.exports = {
  name: "8ball",
  category: "Fun",
  description: "Ask a question to 8ball",
  usage: "<question>",
  cooldown: 5,
  execute(bot, message, args) {
    if (!args[0]) return message.channel.send(":x: | You have to ask a question to 8ball!");
    if (args.join(' ').length >= 256 || args.join(' ').length < 1) return message.channel.send(":x: | Question must be in range of 1 to 256 characters!");
    
    const yesList = ["Truth", "Thats true", "Yes, yes it is", "Of course"];
    const maybeList = ["Hmm...","Maybe??","I dunno","I wish i knew that","Im not sure"];
    const noList = ["Nope.","Lies!","Uhh... No","Not really","I dont think thats true"];
    const chance = Math.floor(Math.random() * 3);
    
    let ballEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
      .setDescription(`**${args.slice().join(" ")}**`);

    if (chance === 0) {
      const answer = yesList[Math.floor(Math.random() * yesList.length)];
      ballEmbed.addField("**Yes!**", answer);
      ballEmbed.setColor("GREEN");
    } else if (chance === 1) {
      const answer = maybeList[Math.floor(Math.random() * maybeList.length)];
      ballEmbed.addField("**Maybe...**", answer);
      ballEmbed.setColor("GOLD");
    } else if (chance === 2) {
      const answer = noList[Math.floor(Math.random() * noList.length)];
      ballEmbed.addField("**No.**", answer);
      ballEmbed.setColor("RED");
    }

    message.channel.send(ballEmbed);
  }
};

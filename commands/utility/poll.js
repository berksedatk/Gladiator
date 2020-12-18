const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "poll",
  category: "Moderation",
  description: "Create a poll",
  usage: "[time] <poll>",
  examples: "g!poll Should we make a nitro event?\ng!poll 30m Should I dye my hair pink?",
  cooldown: 5,
  reqPermissions: ['MANAGE_MESSAGES'],
  async execute(bot, message, args) {
    if (!args[0]) return message.error("You didnt provide a time or a poll.", true, this.usage)
    let time = args[0] ? (ms(args[0]) || null) : null
    if (time > 86400000) return message.error("Time cannot be longer than a day");
    if (time === null) {
      const pollEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setDescription(args.join(' '))
      .setColor('#f5ce42')
      .setTimestamp()
      message.channel.send(pollEmbed).then(msg => {
        msg.react('✅')
        msg.react('❌')
      })
    } else {
      args.shift()
      const pollEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setDescription(args.join(' '))
      .setFooter(`Poll will last ${ms(time, {long: true})}`)
      .setColor('#f5ce42')
      .setTimestamp()
      let msg = await message.channel.send(pollEmbed)

      msg.react('✅')
      msg.react('❌')

      let tick = 0;
      let cross = 0;

      let collector = msg.createReactionCollector((r, u) => r.emoji.name === "✅" || r.emoji.name === "❌", { time: time })

      collector.on('end', collected => {
        message.channel.send({
          embed: {
            color: "GREEN",
            timestamp: Date.now(),
            footer: {
              text: `Poll by ${message.author.tag}`,
              icon: message.author.avatarURL()
            },
            title: `Poll has ended!`,
            url: `https://discord.com/channels/${message.channel.id}/${msg.id}`,
            description: `${args.join(' ')}\n\n  ✅ -> ${collected.get("✅").count - 1}, ❌ -> ${collected.get("❌").count - 1}`
          }
        })
      })
    }
  }
};

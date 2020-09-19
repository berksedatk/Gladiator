const Discord = require("discord.js");
const find = require("../../find.js");

module.exports = {
  name: "nickname",
  category: "Moderation",
  description: "Change nickname of members. Leave blank to reset nickname.",
  aliases: ["setnick","nick"],
  usage: "<user - role> [new nickname]",
  examples: "g!nick @UncoolName#6699 Cool Name\ng!nick @Sax#6211",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ["MANAGE_NICKNAMES"],
  async execute(bot, message, args) {

    if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You didn't provided a user.");

    let user = await find.guildMember(bot, message, args[0])

    args.shift();
    let nick = args.join(" ");
    if (nick.length >= 32) return message.channel.send("<:cross:724049024943915209> | Nickname must be 32 or fewer in lenght.");

    if (!message.guild.members.cache.get(user.id).manageable && user.id != bot.user.id) return message.channel.send("<:cross:724049024943915209> | This user is way too powerful than me.");
    user.setNickname(nick, "Requested by " + message.author.username).then(() => {
      if (nick.length < 1) {
        return message.channel.send(`<:tick:724048990626381925> | **${user.user.tag}**'s nickname has been cleared succesfully.`);
      } else {
        return message.channel.send(`<:tick:724048990626381925> | **${user.user.tag}**'s nickname has been changed to **${nick}** succesfully.`);
      }
    }).catch(err => {
      return message.channel.send("An error occured: " + err)
    })
  }
};

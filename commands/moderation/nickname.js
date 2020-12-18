const Discord = require("discord.js");
const find = require("../../utility/find.js");

module.exports = {
  name: "nickname",
  category: "Moderation",
  description: "Change nickname of members. Leave blank to reset nickname.",
  aliases: ["setnick","nick"],
  usage: "<user> [nickname]",
  examples: "g!nick @UncoolName#6699 Cool Name\ng!nick @Sax#6211",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ["MANAGE_NICKNAMES"],
  botPermissions: ["MANAGE_NICKNAMES"],
  async execute(bot, message, args) {

    if (!args[0]) return message.error("You didn't provided a user.", true, this.usage);

    let user = await find.guildMember(bot, message, args[0])

    args.shift();
    let nick = args.join(" ");
    if (nick.length >= 32) return message.error("Nickname must be 32 or fewer in lenght.");

    if (!user.manageable && user.id != bot.user.id) return message.error("This user is way too powerful than me.");
    user.setNickname(nick, "Requested by " + message.author.username).then(() => {
      if (nick.length < 1) {
        return message.success(`**${user.user.tag}**'s nickname has been cleared succesfully.`);
      } else {
        return message.success(`**${user.user.tag}**'s nickname has been changed to **${nick}** succesfully.`);
      }
    }).catch(err => {
      return message.channel.send("An error occured: " + err)
    })
  }
};

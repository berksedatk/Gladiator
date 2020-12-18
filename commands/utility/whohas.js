const Discord = require("discord.js");
const find = require("../../utility/find.js");

module.exports = {
  name: "whohas",
  category: "Utility",
  description: "See who has the role you specify.",
  aliases: ["whohasrole"],
  usage: "<role>",
  cooldown: 5,
  async execute(bot, message, args) {
    if (!args[0]) return message.error("You didn't provide a role.", true, this.usage);

    let role = await find.role(bot, message, args[0])
    if (!role) return message.error("You didn't provide a true role.", true, this.usage);

    await message.guild.members.fetch()

    let count = 0;
    let members = []
    message.guild.members.cache.forEach(member => {
      if (member.roles.cache.get(role.id)) {
        count++
        members.push(`<@${member.id}>`)
      }
    });

    let whoEmbed = new Discord.MessageEmbed()
    .setTitle(role.name)
    .setColor(role.color)
    .setTimestamp()
    .setFooter(`Requested by ${message.author.tag}`)
    .addField(`[${count}] Members`, members.join(", ").length > 1024 ? members.slice(0,38).join(", ") + `, ${count - 38} more...` : (members.join(", ").length < 1 ? "No one. Not a single soul." : members.join(", ")))
    message.channel.send(whoEmbed)
  }
};

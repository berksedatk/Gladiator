const Discord = require("discord.js");
const find = require("../find.js");

function prettyString(string) {
 return string.replace(/_/g, " ").replace(/guild/gi, "Server").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
}

module.exports = {
  name: "roleinfo",
  category: "Utility",
  description: "Lists the information about a role.",
  usage: "<role>",
  cooldown: 5,
  guildOnly: "true",
  async execute(bot, message, args) {

    if (!args[0]) return message.channel.send(":x: | You didn't provide a role.");

    let role = await find.role(bot, message, args[0])
    if (!role) return message.channel.send(":x: | You didn't provide a true role.");

    let count = 0;
    message.guild.members.cache.forEach(member => {
      if (member.roles.cache.get(role.id)) count++
    })

    let perms = []
    role.permissions.toArray().forEach(perm => {
    perms.push(prettyString(perm))
    })

    const roleEmbed = new Discord.MessageEmbed()
      .setTitle(`**${role.name}**`)
      .setTimestamp()
      .setColor(role.color)
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .setDescription(`Role ID: ${role.id}`)
      .addField("Seperated", String(role.hoist)[0].toUpperCase() + String(role.hoist).substr(1), true)
      .addField("Mentionable", String(role.mentionable)[0].toUpperCase() + String(role.mentionable).substr(1), true)
      .addField("Position", `${role.rawPosition}/${message.guild.roles.cache.size - 1}`, true)
      .addField("Member Count", count, true)
      .addField("Bot Role", String(role.managed)[0].toUpperCase() + String(role.managed).substr(1), true)
      .addField("Color(Hex) Code", '#' + role.color.toString(16), true)
      .addField("Created At", role.createdAt.toUTCString())
      .addField("Permissions", `${perms.length > 0 ? perms.join(", ") : "No Permissions"}`, true);
    return message.channel.send(roleEmbed);
  }
};

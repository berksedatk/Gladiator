const Discord = require("discord.js");

function colorToHexString(dColor) {
    return '#' + ("000000" + (((dColor & 0xFF) << 16) + (dColor & 0xFF00) + ((dColor >> 16) & 0xFF)).toString(16)).slice(-6);
}

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

    let role = message.mentions.roles.first() ? message.mentions.roles.first()
      : (message.guild.roles.cache.get(args[0]) ? message.guild.roles.cache.get(args[0])
      : (message.guild.roles.cache.filter(role => role.name.includes(args[0])).size >= 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[0])).array()
      : null))

    if (role === null) return message.channel.send(":x: | You didn't provide a true role.");

    if (role.length > 1) {
      let rolemsg = "";
      for (let i = 0; i < role.length; i++) {
        rolemsg += `\n${i + 1} - ${role[i]}`
      }

      let msg = await message.channel.send("", {embed: {description: `**There are multiple roles found with name '${args[0]}', which one would you like to use?** \n${rolemsg}`, footer: {text: "You have 30 seconds to respond."}, timestamp: Date.now()}});
      let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 15000, max: 1 })
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
      role = role[collected.first().content - 1]
      msg.delete()
      let count = 0;
        message.guild.members.cache.forEach(member => {
          if (member.roles.cache.get(role.id)) count++
        })
        let perms = []
        role.permissions.toArray().forEach(perm => {
          perms.push(prettyString(perm))
        })
        sendRoleEmbed(role, count, perms);
    } else {
      role = role[0] || role
      let count = 0;
      message.guild.members.cache.forEach(member => {
        if (member.roles.cache.get(role.id)) count++
      })
      let perms = []
      role.permissions.toArray().forEach(perm => {
        perms.push(prettyString(perm))
      })
      sendRoleEmbed(role, count, perms);
    }

    function sendRoleEmbed(role, count, perms) {
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
        .addField("Color(Hex) Code", colorToHexString(role.color), true)
        .addField("Created At", role.createdAt.toUTCString())
        .addField("Permissions", `${perms.join(', ')}`, true);
      message.channel.send(roleEmbed);
    }
  }
};

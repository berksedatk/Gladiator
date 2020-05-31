const Discord = require("discord.js");

function colorToHexString(dColor) {
    return '#' + ("000000" + (((dColor & 0xFF) << 16) + (dColor & 0xFF00) + ((dColor >> 16) & 0xFF)).toString(16)).slice(-6);
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
    let roles = message.mentions.roles.first() ? message.mentions.roles.first()
      : (message.guild.roles.cache.get(args[0]) ? message.guild.roles.cache.get(args[0])
      : (message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(args[0].toLowerCase())).size >= 1 ? message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(args[0].toLowerCase())).array()
      : null))
      
    if (roles === null) return message.channel.send(":x: | You didn't provide a true role.");

    if (roles.length > 1) {
      let rolemsg = "";
      for (let i = 0; i < roles.length; i++) {
        rolemsg += `\n${i + 1} - ${roles[i].name}`
      }
      message.channel.send(`There are multiple roles found with name '${args[0]}', which one would you like to use? ${rolemsg}`)
      await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 15000, max: 1, errors:['time'] }).then(collected => {
        if (Number(collected.first().content) > roles.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
        roles = roles[collected.first().content - 1]
        let count = 0;
        message.guild.members.cache.forEach(member => {
          if (member.roles.cache.get(roles.id)) count++
        })  
        sendRoleEmbed(roles, count);
      }).catch(err => {
        return message.channel.send(":x: | Command cancelled.");
      });
    } else {
      roles = roles[0] || roles
      let count = 0;
      message.guild.members.cache.forEach(member => {
        if (member.roles.cache.get(roles.id)) count++
      }) 
      sendRoleEmbed(roles, count);
    }
    function sendRoleEmbed(role, count) {
      const roleEmbed = new Discord.MessageEmbed()
        .setTitle(`**${role.name}**`)
        .setTimestamp()
        .setColor(role.color)
        .setFooter("Requested by " + message.author.username, message.author.avatarURL())
        .addField("Role Id", role.id, true)
        .addField("Seperated", role.hoist, true)
        .addField("Mentionable", role.mentionable, true)
        .addField("Position", `${role.position}/${message.guild.roles.cache.size}`, true)
        .addField("Member Count", count, true)
        .addField("Bot role", role.managed, true)
        .addField("Color(Hex) code", colorToHexString(role.color), true)
        .addField("Permissions", `\`${role.permissions.toArray().join(', ')}\``, true);       
      message.channel.send(roleEmbed);
    }
  }
};

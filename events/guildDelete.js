const Discord = require('discord.js');

module.exports = {
  execute(bot, guild, db) {
    
    //Send message to the logging channel
    const serverEmbed = new Discord.MessageEmbed()
      .setTitle("**Server Removed!**")
      .setTimestamp()
      .setColor("RED")
      .setThumbnail(guild.iconURL())
      .setFooter("New server count " + bot.guilds.cache.size, bot.user.avatarURL())
      .addField(`**${guild.name}**(${guild.id})`, `-Owner: **${guild.owner.user.tag}**(${guild.owner.user.id}) \n-Member Count: **${guild.memberCount}** members`);
    bot.channels.cache.get("626060601172426754").send(serverEmbed);
    bot.channels.cache.get("673869397277933653").send(serverEmbed);
  }
}

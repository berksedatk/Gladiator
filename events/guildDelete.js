const { MessageEmbed } = require('discord.js');
const Guild = require("../schemas/guild.js");

module.exports = async (bot, guild) => {
  if (guild.partial) await guild.fetch();
  const serverEmbed = new MessageEmbed()
  .setAuthor(guild.owner.user.tag, guild.owner.user.avatarURL())
  .setTitle("Server Removed!")
  .setColor("RED")
  .setTimestamp()
  .setFooter(`New server count: ${bot.guilds.cache.size}`)
  .setDescription(`Server Name: **${guild.name}**(${guild.id}) \nMember Count: **${guild.members.cache.size}** members.`)
  guild.iconURL() ? serverEmbed.setThumbnail(guild.iconURL()) : null
  bot.channels.cache.get("673869397277933653").send(serverEmbed);

  Guild.findOne({ guildID: guild.id }, (err, dbGuild) => {
    if (err) console.log(`guildRemove: removed to true - An error occured: ${err}`);
    if (dbGuild) {
      dbGuild.removed = true
      dbGuild.save().then(() => console.log(`${guild.name} has been removed.`)).catch(err => {console.log(`guildRemove: removed to true - ${guild.id} has been removed but the Database could not be updated: ${err}`)})
    }
  });
}

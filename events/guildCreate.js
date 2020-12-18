const { MessageEmbed } = require('discord.js');
const Guild = require("../schemas/guild.js");

module.exports = async (bot, guild) => {
  await guild.fetch();
  let guildOwner = await guild.members.fetch(guild.ownerID)
  const serverEmbed = new MessageEmbed()
  .setAuthor(guildOwner.user.tag, guildOwner.user.avatarURL())
  .setTitle("New Server!")
  .setColor("GREEN")
  .setTimestamp()
  .setFooter(`New server count: ${bot.guilds.cache.size}`)
  .setDescription(`Server Name: **${guild.name}**(${guild.id}) \nMember Count: **${guild.memberCount}** members.`)
  guild.iconURL() ? serverEmbed.setThumbnail(guild.iconURL()) : null
  bot.channels.cache.get("673869397277933653").send(serverEmbed);

  Guild.findOne({ guildID: guild.id }, (err, dbGuild) => {
    if (err) {
      console.log(`New Guild could not be added: ${err}`);
      bot.users.cache.get(guild.owner.id).send("There was an error while creating server settings, please contact a bot dev! (https://discord.gg/tkR2nTf)").catch(err => console.log(err));
    }
    if (dbGuild) {
      console.log(`Joined a new guild but database was already set: ${guild.id}, attempting to switch removed to false...`);
      dbGuild.removed = false
      dbGuild.save().then(() => console.log(`${guild.id} has been back.`)).catch(err => {console.log(`guildCreate: removed to false - ${guild.id} has been added back but the Database could not be updated: ${err}`)})
    }
    if (!dbGuild) require("../utility/addguild.js")(guild);
  });
}

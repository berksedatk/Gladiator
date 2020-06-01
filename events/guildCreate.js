const Discord = require('discord.js');
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  execute(bot, guild, db) {
  
  //Message guild owner
  bot.users.cache.get(guild.owner.id).send("Thanks for adding me to your server!").catch(err => console.log(err));

  //Send message to logging channel
  const serverEmbed = new Discord.MessageEmbed()
    .setTitle("**New server!**")
    .setTimestamp()
    .setColor("GREEN")
    .setThumbnail(guild.iconURL())
    .setFooter("New server count " + bot.guilds.cache.size, bot.user.avatarURL())
    .addField(`**${guild.name}**(${guild.id})`, `-Owner: **${guild.owner.user.tag}**(${guild.owner.user.id}) \n-Member Count: **${guild.memberCount}** members`);
  bot.channels.cache.get("626060601172426754").send(serverEmbed);
  bot.channels.cache.get("673869397277933653").send(serverEmbed);

  Guild.findOne({ guildID: guild.id }, (err, dbGuild) => {
    if (err) {
      console.log(`New Guild could not be added: ${err}`);
      bot.users.cache.get(guild.owner.id).send("There was an error while creating server settings, please contact a bot dev! (https://discord.gg/tkR2nTf)").catch(err => console.log(err));
    }
    if (dbGuild) return console.log(`Joined a new guild but database was already set! ${guild.name}`);
    if (!dbGuild) {
      const guildschema = new Guild({
        _id: mongoose.Types.ObjectId(),
        guildName: guild.name,
        guildID: guild.id,
        blacklisted: false,
        settings: {     
          join: {
            role: null,
            botrole: null,
            channel: "default",
            message: false
          },
          levelup: {
            message: "default",
            channel: "default",
            send: true
          },
          blacklist: {
            list: [],
            enabled: false
          },
        },
        cases: {},
        members: {},
        levelroles: {},
        xproles: {},
        reactionroles: {}
      });
      guildschema.save().then(() => console.log("A new Guild database has been added. " + guild.name)).catch(err => console.log("New Guild cannot be added to the databse! " + err))
    }
  })
  }
}

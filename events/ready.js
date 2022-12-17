const config = require('../config.json');
const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js')
const Mute = require("../schemas/mute.js");
const Guild = require('../schemas/guild.js');

module.exports = async client => {
  
  //User activity
  client.user.setActivity("Google Chrome | g!help", {
    type: "PLAYING"
  });

  //Mutes
  setInterval(() => {
    Mute.find({}, (err, mutes) => {
      mutes.forEach(mute => {
        if (mute.time != undefined && Date.now() > mute.time) {
          mute.delete().then(() => {
            try {
              client.guilds.cache.get(mute.guildID).members.cache.get(mute.userID).roles.remove(mute.role)
            } catch(err) {
              console.log(`ready: Mutes - Could not remove the mute! ${client.guilds.cache.get(mute.guildID).name} -> ${client.guilds.cache.get(mute.guildID).members.cache.get(mute.userID).user.tag}`)
            }
          })
        }
      })
    })
  }, 10000)

  //Guild Settings
  let fetched = 0
  await Guild.find({}, (err, guilds) => {
    guilds.forEach(guild => {
      let guildObject = client.guilds.cache.get(guild.guildID)
      if (guildObject) {
        fetched += 1
        guildObject.settings = guild.settings
        guildObject.blacklisted = guild.blacklisted
        guildObject.overridePermissions = guild.overridePermissions
      }
    })
  })
  console.log(`${fetched}/${client.guilds.cache.size} Guilds have been fetched.`)

  //backups
  setInterval(() => {
    console.log('Backup is running...')
    require('../utility/backup.js').dbAutoBackUp()
    bot.channels.cache.get(config.backupLogs).send(new MessageEmbed()
      .setDescription('Database backup has started.')
      .setTimestamp()
      .setColor('GREEN')
    )
  }, 86400000);

  //Client info
  console.log(`Discord - Bot is ready.
  Client User: ${client.user.tag}
  Guild Count: ${client.guilds.cache.size}
  User Count: ${client.users.cache.size}`);

  client.ready = true
};

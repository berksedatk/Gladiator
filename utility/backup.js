const Guilds = require("../schemas/guild.js");
const Discord = require("discord.js");

module.exports = async client => {
  const fs = require('fs');

  let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
  let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);

  let title = `backups/Gladiator_Backup_${year}-${month}-${date}_${hour}-${minute}-${second}.txt`
  let logChannel = client.channels.cache.get("777261291215126528");

  Guilds.find({}, async (err, guilds) => {
    fs.writeFile(title, guilds.toString(), (err, file) => {
      if (err) {
        console.log("An error has occured while backing up the database: " + err)
        return logChannel.send({embed: {
          description: "Database backup for Gladiator could not be completed: " + err,
          timestamp: Date.now(),
          color: "RED"
        }})
      }
      console.log("Database backup has successfully been completed.")
      return logChannel.send({embed: {
        description: "Database backup for Gladiator has successfully been completed.",
        timestamp: Date.now(),
        color: "GREEN"
      }})
    })
  })
}

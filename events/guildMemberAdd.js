const Discord = require('discord.js');
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = {
  execute(bot, guildMember, db) {
    Guild.findOne({ guildID: guildMember.guild.id }, (err, guild) => {
      if (err) return console.log(`Could not add a new member to guild! ${err}`);
      if (!guild) return console.log(`Could not add a new member to guild, Database does not exist!`)
      if (guild) {

        //Join msg
        if (guild.settings.join.send && !guildMember.user.bot) {
          if (guild.settings.join.channel === "default") {
            if (!guildMember.guild.systemChannel) return guildMember.guild.owner.send(`There is no System Channel has been set for your server **${guildMember.guild.name}**! Please use \`g!settings join channel <channel>\` command and add a existing channel.`);
            guildMember.guild.systemChannel.send(`${guildMember}, ${guild.settings.join.message}`);
          } else {
            guildMember.guild.channels.cache.get(guild.settings.join.channel).send(`${guildMember}, ${guild.settings.join.message}`)
          }
        }

        //Autorole
        if (guild.settings.join.autorole) {
          if (guildMember.user.bot) {

            let botrole = guildMember.guild.roles.cache.get(guild.settings.join.botrole)
            if (!botrole) return guildMember.guild.owner.send(`There is no Autorole has been set for your server **${guildMember.guildname}**! Please use \`g!settings join role <role>\` command and add a existing role.`);
            guildMember.roles.add(botrole, "Autorole").catch(err => {
              console.log(`An error occured(${guildMember.guild.name}): ${err}`);
              guildMember.guild.owner.send(`There was an error while adding autorole to a bot! ${err}`);
            })
          } else {

            let role = guildMember.guild.roles.cache.get(guild.settings.join.role)
            if (!role) return guildMember.guild.owner.send(`There is no Autorole has been set for your server **${guildMember.guildname}**! Please use \`g!settings join role <role>\` command and add a existing role.`);
            guildMember.roles.add(role, "Autorole").catch(err => {
              console.log(`An error occured(${guildMember.guild.name}): ${err}`);
              guildMember.guild.owner.send(`There was an error while adding autorole to a member! ${err}`);
            })

            if (!guild.members.get(guildMember.id)) {
              guild.members.set(guildMember.id, {
                username: guildMember.tag,
                id: guildMember.id,
                xp: 0,
                level: 0,
                lastxpmessage: null,
                color: "lightblue",
                mode: "dark"
              })
            }
            guild.save().catch(err => console.log(`An error occured while saving a user to a guild ${guildMember.guild.name}: ${err}`))
          }
        }
      }
    })
  }
}

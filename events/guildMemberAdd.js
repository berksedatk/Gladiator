const Discord = require('discord.js');
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

module.exports = (bot, guildMember) => {
  Guild.findOne({ guildID: guildMember.guild.id }, (err, guild) => {
    if (err) return console.log(`Could not add a new member to guild! ${err}`);
    if (!guild) return console.log(`Could not add a new member to guild, Database does not exist: ${guildMember.guild.name}`)
    if (guild) {
      //Message
      if (guild.settings.join.message.text.enabled) {
        //User mention -> {{user}} User tag -> {{tag}} Username -> {{username}} GuildName -> {{server}} Member Count -> {{count}}
        let welcomemsg = guild.settings.join.message.text.message
        let replaceList = [
          {
            replace: "{{user}}",
            with: guildMember.user
          }, {
            replace: "{{tag}}",
            with: guildMember.user.tag
          }, {
            replace: "{{username}}",
            with: guildMember.user.username
          }, {
            replace: "{{server}}",
            with: guildMember.guild.name
          }, {
            replace: "{{count}}",
            with: guildMember.guild.members.cache.size + 1
          }
        ]
        replaceList.forEach(s => {
          welcomemsg = welcomemsg.replace(s.replace, s.with)
        });
        if (guild.settings.join.message.channel != null) bot.channels.cache.get(guild.settings.join.message.channel).send(welcomemsg)
      }

      //Autorole
      if (guild.settings.join.autorole.enabled && guildMember.guild.me.permissions.has("MANAGE_ROLES")) {
        if (guild.settings.join.autorole.seperateBots && guildMember.user.bot) {
          guild.settings.join.autorole.botroles.forEach(r => {
            let role = guildMember.guild.roles.cache.get(r)
            if (role) guildMember.roles.add(role, "Autorole")
          })
        } else if (guild.settings.join.autorole.seperateBots && !guildMember.user.bot) {
          guild.settings.join.autorole.userroles.forEach(r => {
            let role = guildMember.guild.roles.cache.get(r)
            if (role) guildMember.roles.add(role, "Autorole")
          })
        } else if (!guild.settings.join.autorole.seperateBots) {
          guild.settings.join.autorole.userroles.forEach(r => {
            let role = guildMember.guild.roles.cache.get(r)
            if (role) guildMember.roles.add(role, "Autorole")
          })
        }
      }

      //Add user to Database
      let member = guild.members.get(guildMember.id)
      if (!member) {
        guild.members.set(guildMember.id, {
          username: guildMember.user.tag,
          id: guildMember.id,
          xp: "0",
          level: "0",
          color: "#add8e6",
          lastxpmessage: guildMember.joinedTimestamp
        })
        guild.save().catch(err => console.log(`Error while adding a user to guild ${guildMember.guild.name} -> ${guildMember.user.tag}`));
      }
    }
  });
}

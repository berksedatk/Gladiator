const Discord = require("discord.js");
const ms = require("ms");
const prettyms = require("pretty-ms");
const find = require("../../utility/find.js");

function prettyString(string) {
 return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}).replace(/_/g, " ").replace(/guild/gi, "Server")
}

module.exports = {
  name: "userinfo",
  category: "Utility",
  description: "Lists information about a user.",
  usage: "[user]",
  aliases: ['ui'],
  cooldown: 5,
  guildOnly: true,
  async execute(bot, message, args) {

    let user,joinposition,content,roles,icon;

    if (!args[0]) {
      user = message.member
    } else {
      user = await find.guildMember(bot, message, args[0])
      if (!user) {
        user = await find.user(bot, message, args[0])
      }
      if (!user) return message.error("You didn't provide a true user.", true, this.usage);
    }
    if (user.guild) {
      //Join Pos

      await message.guild.members.fetch()
      
      let arr = message.guild.members.cache.array();
      arr.sort((a, b) => a.joinedAt - b.joinedAt);

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == user.id) joinposition = i;
      }

      //Roles
      roles = `<@&${user._roles.join(">, <@&")}>`;
      if (roles.length > 1024) {
        roles = "Too many roles!"; //roles.slice(-(1024 - roles.length))
      }

      //Last message
      if (user.lastMessage === null) {
        content = "Nothing";
      } else {
        content = `> ${user.lastMessage}(${user.lastMessageID})`;
      }

      //Icon
      icon = user.user.bot ? `<:bot:724052575405735997>` : (message.guild.owner.id === user.user.id ? `<:owner:724048854592520283>`: ``)
    }

    let badges = []
    if (user.flags || user.user.flags) {
      let flags = user.guild ? user.user.flags : user.flags
      flags.toArray().forEach(badge => {
        switch (badge) {
          case "DISCORD_EMPLOYEE":
            badges.push("<:discordmod:724048439557619775> - Discord Employee")
            break;
          case "DISCORD_PARTNER":
            badges.push("<:partneruser:724048499917979840> - Discord Partner")
            break;
          case "HYPESQUAD_EVENTS":
            badges.push("<:hypesquad:724048305398480907> - Hypesquad Events")
            break;
          case "BUGHUNTER_LEVEL_1":
            badges.push("<:bughunter:724048542716526602> - Bug Hunter")
            break;
          case "BUGHUNTER_LEVEL_2":
            badges.push("<:bughunter2:724048584655372448> - Bug Hunter Level 2")
            break;
          case "HOUSE_BRAVERY":
            badges.push("<:bravery:724048228877860885> - Hypesquad Bravery")
            break;
          case "HOUSE_BRILLIANCE":
            badges.push("<:briliance:724048274310430731> - Hypesquad Brilliance")
            break;
          case "HOUSE_BALANCE":
            badges.push("<:balance:724048116394885150> - Hypesquad Balance")
            break;
          case "EARLY_SUPPORTER":
            badges.push("<:earlysupporter:724048623888891955> - Early Supporter")
            break;
          case "SYSTEM":
            badges.push("SYSTEM")
            break;
          case "VERIFIED_BOT":
            badges.push("<:verified:724048680029519872> - Verified Bot")
            break;
          case "VERIFIED_DEVELOPER":
            badges.push("<:botdev:724047952196403322> - Verified Bot Developer")
            break;
        }
      })
    }

    const userinfoEmbed = new Discord.MessageEmbed()
      .setAuthor(`${user.guild ? user.user.tag : user.tag}`, user.guild ? user.user.avatarURL() : user.avatarURL())
      .setThumbnail(user.guild ? user.user.avatarURL() : user.avatarURL())
      .setDescription(`${icon} User ID: ${user.id}`)
      .setTimestamp()
      .setColor(user.displayColor || "#ffffff")
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .addField("Discord Join Date", `${user.guild ? user.user.createdAt.toUTCString() : user.createdAt.toUTCString()}\n(${prettyms(Date.now() - (user.guild ? user.user.createdAt : user.createdAt), { verbose: true })} ago)`)
      user.guild ? userinfoEmbed.addField("Guild Join Date", `${user.joinedAt.toUTCString()}\n(${prettyms(Date.now() - user.joinedTimestamp, { verbose: true })} ago)`, true) : null
      user.guild ? userinfoEmbed.addField("Join Position",`#${joinposition + 1}`, true) : null
      user.guild ? userinfoEmbed.addField("Nickname", user.nickname ? user.nickname : "Nothing") : null
      userinfoEmbed.addField("Badges", badges.length >= 1 ? badges : "No Badges")
      user.guild ? userinfoEmbed.addField("Last Message", content) : null
      user.guild ? userinfoEmbed.addField(`Roles [${user.roles.cache.size}]`, roles) : null
    message.channel.send(userinfoEmbed);
  }
};

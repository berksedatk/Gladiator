const Discord = require("discord.js");
const ms = require("ms");
const prettyms = require("pretty-ms");
const find = require("../../find.js");

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

    let user,joinposition,presenceMes,content,roles;
    let icon = "<:offline2:724050268907372624>";
    let platforms = "";

    if (!args[0]) {
      user = message.member
    } else {
      user = await find.guildMember(bot, message, args[0])
      if (!user) {
        user = await find.user(bot, message, args[0])
      }
      if (!user) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true user.");
    }
    if (user.guild) {
      //Presence
      if (user.presence.activities[0]) {
        if (user.presence.activities[0].type == "PLAYING") {
          presenceMes = `Playing **${user.presence.activities[0].name}**`;
        } else if (user.presence.activities[0].type == "STREAMING") {
          presenceMes = `Streaming **${user.presence.activities[0].name}**`;
        } else if (user.presence.activities[0].type == "LISTENING") {
          presenceMes = `Listening **${user.presence.activities[0].name}**`;
        } else if (user.presence.activities[0].type == "WATCHING") {
          presenceMes = `Watching **${user.presence.activities[0].name}**`;
        } else if (user.presence.activities[0].type == "CUSTOM_STATUS") {
          if (user.presence.activities[0].emoji == null) {
            presenceMes = `Custom Status **${user.presence.activities[0].state}**`;
          } else  {
            presenceMes = `Custom Status ${user.presence.activities[0].emoji} **${user.presence.activities[0].state}**`;
          }
        } else {
          presenceMes = 'Something is wrong... Pls contract support';
        }
      } else {
        presenceMes = 'Nothing';
      }
      //Join Pos
      let arr = message.guild.members.cache.array();
      arr.sort((a, b) => a.joinedAt - b.joinedAt);

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == user.id) joinposition = i;
      }

      //Platforms
      let plat = user.presence.clientStatus;
      if (plat == null || JSON.stringify(plat) == "{}") {
        platforms += "<:offline:724047678954274867> Offline";
        icon = "<:offline2:724050268907372624>"
      } else {
        if (plat.mobile) {
          if (plat.mobile === "online") {
            platforms += `Mobile: <:mobile2:724052069824200754> Online\n`
            icon = `<:online2:723959335209664535>`
          } else if (plat.mobile === "idle") {
            platforms += `Mobile: <:idle:723959173876023366> Idle\n`
            icon = `<:idle2:723959389006069841>`
          } else if (plat.mobile === "dnd") {
            platforms += `Mobile: <:dnd:723959216481632277> DND\n`
            icon = `<:dnd2:723959428679991336>`
          }
        }
        if (plat.web) {
          if (user.presence.activities[0]) {
            if (user.presence.activities[0].type === "STREAMING") {
              platforms += `Web: <:streaming:723959296076808262> Online\n`
              icon = `<:streaming2:724050154273112175>`
            } else {
              if (plat.web === "online") {
                platforms += `Web: <:online:723959109468291072> Online\n`
                icon = `<:online2:723959335209664535>`
              } else if (plat.web === "idle") {
                platforms += `Web: <:idle:723959173876023366> Idle\n`
                icon = `<:idle2:723959389006069841>`
              } else if (plat.web === "dnd") {
                platforms += `Web: <:dnd:723959216481632277> DND\n`
                icon = `<:dnd2:723959428679991336>`
              }
            }
          } else {
            if (plat.web === "online") {
              platforms += `Web: <:online:723959109468291072> Online\n`
              icon = `<:online2:723959335209664535>`
            } else if (plat.web === "idle") {
              platforms += `Web: <:idle:723959173876023366> Idle\n`
              icon = `<:idle2:723959389006069841>`
            } else if (plat.web === "dnd") {
              platforms += `Web: <:dnd:723959216481632277> DND\n`
              icon = `<:dnd2:723959428679991336>`
            }
          }
        }
        if (plat.desktop) {
          if (user.presence.activities[0]) {
            if (user.presence.activities[0].type === "STREAMING") {
              platforms += `Desktop: <:streaming:723959296076808262> Online`
              icon = `<:streaming2:724050154273112175>`
            } else {
              if (plat.desktop === "online") {
                platforms += `Desktop: <:online:723959109468291072> Online\n`
                icon = `<:online2:723959335209664535>`
              } else if (plat.desktop === "idle") {
                platforms += `Desktop: <:idle:723959173876023366> Idle\n`
                icon = `<:idle2:723959389006069841>`
              } else if (plat.desktop === "dnd") {
                platforms += `Desktop: <:dnd:723959216481632277> DND\n`
                icon = `<:dnd2:723959428679991336>`
              }
            }
          } else {
            if (plat.desktop === "online") {
              platforms += `Desktop: <:online:723959109468291072> Online\n`
              icon = `<:online2:723959335209664535>`
            } else if (plat.desktop === "idle") {
              platforms += `Desktop: <:idle:723959173876023366> Idle\n`
              icon = `<:idle2:723959389006069841>`
            } else if (plat.desktop === "dnd") {
              platforms += `Desktop: <:dnd:723959216481632277> DND\n`
              icon = `<:dnd2:723959428679991336>`
            }
          }
        }
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
      icon += user.user.bot ? `<:bot:724052575405735997>` : (message.guild.owner.id === user.user.id ? `<:owner:724048854592520283>`: ``)
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
      user.guild ? userinfoEmbed.addField("Status", platforms, true) : null
      user.guild ? userinfoEmbed.addField("Presence", presenceMes, true) : null
      userinfoEmbed.addField("Badges", badges.length >= 1 ? badges : "No Badges")
      user.guild ? userinfoEmbed.addField("Last Message", content) : null
      user.guild ? userinfoEmbed.addField(`Roles [${user.roles.cache.size}]`, roles) : null
    message.channel.send(userinfoEmbed);
  }
};

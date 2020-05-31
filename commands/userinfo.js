const Discord = require("discord.js");

module.exports = {
  name: "userinfo",
  category: "Utility",
  description: "Lists information about a user.",
  usage: "[user]",
  aliases: ['ui'],
  cooldown: 5,
  guildOnly: true,
  execute(bot, message, args) {
    let member
    if (!args[0]) {
      member = message.author
    } else {
      member = message.mentions.users.first() ? message.mentions.users.first() 
      : (message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0])
      : (message.guild.members.cache.filter(user => user.user.username.toLowerCase().includes(args[0].toLowerCase())).first() ? message.guild.members.cache.filter(user => user.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
      : null))
      if (member === null) return message.channel.send(":x: | This user does not exist.");
    }
    member = message.guild.members.cache.get(member.id)
    console.log(member)
    let presenceMes;
    if (member.presence.activities[0]) {   
      if (member.presence.activities[0].type == "PLAYING") {
        presenceMes = `Playing **${member.presence.activities[0].name}**`;
      } else if (member.presence.activities[0].type == "STREAMING") {
        presenceMes = `Streaming **${member.presence.activities[0].name}**`;
      } else if (member.presence.activities[0].type == "LISTENING") {
        presenceMes = `Listening **${member.presence.activities[0].name}**`;
      } else if (member.presence.activities[0].type == "WATCHING") {
        presenceMes = `Watching **${member.presence.activities[0].name}**`;
      } else if (member.presence.activities[0].type == "CUSTOM_STATUS") {
        if (member.presence.activities[0].emoji == null) {
          presenceMes = `Custom Status **${member.presence.activities[0].state}**`;
        } else  {
          presenceMes = `Custom Status ${member.presence.activities[0].emoji} **${member.presence.activities[0].state}**`;
        }      
      } else {
        presenceMes = 'Something is wrong... Pls contract support';
      }
    } else {
      presenceMes = 'Nothing';
    }
    let joinposition;
    
    let arr = message.guild.members.cache.array();
    arr.sort((a, b) => a.joinedAt - b.joinedAt);

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == member.id) joinposition = i;
    }

    let platforms = "";
    let plat = member.presence.clientStatus;
    if (plat == null || JSON.stringify(plat) == "{}") {
      platforms += "Offline";
    } else {
      if (plat.web) {
        platforms += `Web: ${plat.web}\n`;
      }
      if (plat.mobile) {
        platforms += `Mobile: ${plat.mobile}\n`;
      }
      if (plat.desktop) {
        platforms += `Desktop: ${plat.desktop}\n`;
      }
    }
    
    let roles = `<@&${member._roles.join(">, <@&")}>`; 
    if (roles.length > 1024) {
      roles = "Too many roles!"; //roles.slice(-(1024 - roles.length))
    }

    let content;
    if (member.lastMessage === null) {
      content = "Nothing";
    } else {
      content = `> ${member.lastMessage}(${member.lastMessageID})`;
    }
    sendUserinfoEmbed(member);

    function sendUserinfoEmbed(member) {
      const userinfoEmbed = new Discord.MessageEmbed()
        .setAuthor(member.user.tag, member.user.avatarURL())
        .setDescription(`User ID: ${member.id}`)
        .setTimestamp()
        .setColor(member.displayColor)
        .setFooter("Requested by " + message.author.username, message.author.avatarURL())
        .setThumbnail(member.user.avatarURL)
        .addField("Discord Join Date", member.user.createdAt)
        .addField("Guild Join Date", member.joinedAt, true)
        .addField("Join Position",`${joinposition + 1}.`, true)
        .addField("Nickname", member.nickname ? member.nickname : "Nothing")
        .addField("Status", platforms, true)
        .addField("Presence", presenceMes, true)
        .addField("Last Message", content)    
        .addField("Roles", roles);
      message.channel.send(userinfoEmbed);
    }
  }
};

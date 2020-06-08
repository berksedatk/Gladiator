const Discord = require("discord.js");

module.exports = {
  name: "userinfo",
  category: "Utility",
  description: "Lists information about a user.",
  usage: "[user]",
  aliases: ['ui'],
  cooldown: 5,
  guildOnly: true,
  async execute(bot, message, args) {

    if (!args[0]) return message.channel.send(":x: | You didn't provide a user.");
    let user = message.mentions.users.first() ? message.mentions.users.first()
      : (message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0])
      : (message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(args[0].toLowerCase())).size > 0 ? message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(args[0].toLowerCase())).array()
      : undefined))
    if (!user) return message.channel.send(":x: | You didn't provide a true user.");

    if (user.length > 1) {
      let usermsg = "";
        for (let i = 0; i < (user.length > 10 ? 10 : user.length); i++) {
      usermsg += `\n${i + 1} -> ${user[i].user.username}`;
      }

      let msg = await message.channel.send("", {embed: {description: `**There are multiple users found with name '${args[0]}', which one would you like to use?** \n${usermsg}`, footer: {text: "You have 30 seconds to respond."}, timestamp: Date.now()}});
      let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000, errors: ['time'] })
      if (Number(collected.first().content) > user.length) return message.channel.send(":x: | Invalid user number. Command cancelled.");
      user = user[collected.first().content - 1]
      msg.delete()
    } else {
      user = user[0] || message.guild.members.cache.get(user.id)
    }

    let presenceMes;
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
    let joinposition;

    let arr = message.guild.members.cache.array();
    arr.sort((a, b) => a.joinedAt - b.joinedAt);

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == user.id) joinposition = i;
    }

    let platforms = "";
    let plat = user.presence.clientStatus;
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

    let roles = `<@&${user._roles.join(">, <@&")}>`;
    if (roles.length > 1024) {
      roles = "Too many roles!"; //roles.slice(-(1024 - roles.length))
    }

    let content;
    if (user.lastMessage === null) {
      content = "Nothing";
    } else {
      content = `> ${user.lastMessage}(${user.lastMessageID})`;
    }
    const userinfoEmbed = new Discord.MessageEmbed()
      .setAuthor(user.user.tag, user.user.avatarURL())
      .setDescription(`User ID: ${user.id}`)
      .setTimestamp()
      .setColor(user.displayColor)
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .setThumbnail(user.user.avatarURL)
      .addField("Discord Join Date", user.user.createdAt)
      .addField("Guild Join Date", user.joinedAt, true)
      .addField("Join Position",`${joinposition + 1}.`, true)
      .addField("Nickname", user.nickname ? user.nickname : "Nothing")
      .addField("Status", platforms, true)
      .addField("Presence", presenceMes, true)
      .addField("Last Message", content)
      .addField("Roles", roles);
    message.channel.send(userinfoEmbed);
  }
};

const Discord = require("discord.js");
const prettyms = require("pretty-ms");

module.exports = {
  name: "guildinfo",
  category: "Utility",
  description: "Lists the information about the guild you're in.",
  aliases: ["serverinfo","si","gi"],
  cooldown: 5,
  guildOnly: "true",
  execute(bot, message, args) {
    const guild = message.guild;

    let vccount = 0;
    let textcount = 0;
    let newscount = 0;
    let storecount = 0;
    let categorycount = 0;
    guild.channels.cache.map(c => {
      if (c.type === "text") {
        textcount += 1;
      } else if (c.type === "voice") {
        vccount += 1;
      } else if (c.type === "news") {
        newscount += 1;
      } else if (c.type === "store") {
        storecount += 1;
      } else if (c.type === "category") {
        categorycount += 1;
      }
    });

    let usercount = 0;
    let botcount = 0;

    let onlinecount = 0;
    let offlinecount = 0;
    let dndcount = 0;
    let idlecount = 0;

    let mobilecount = 0;
    let webcount = 0;
    let desktopcount = 0;
    guild.members.cache.map(m => {
      if (m.user.bot === true) {
        botcount += 1;
      } else {
        usercount += 1;
        let plat = m.presence.clientStatus;
        if (plat != null && JSON.stringify(plat) != "{}") {
          if (plat.web) webcount += 1;
          if (plat.mobile) mobilecount += 1;
          if (plat.desktop) desktopcount += 1;
        }
        if (m.presence.status == "online") onlinecount += 1;
        if (m.presence.status == "idle") idlecount += 1;
        if (m.presence.status == "dnd") dndcount += 1;
        if (m.presence.status == "offline") offlinecount += 1;
      }
    });

    let features = []
    guild.features.forEach(feature => {
      features.push(feature[0] + feature.replace("_", " ").toLowerCase().substr(1))
    })

    let channels = `Text: ${textcount}, VC: ${vccount}, Category: ${categorycount}`
    if (newscount > 0) channels += ` News: ${newscount}`
    if (storecount > 0) channels += ` Store: ${storecount}`
    let guildEmbed = new Discord.MessageEmbed()
      .setTitle(`**${guild.name}**`)
      .setThumbnail(guild.iconURL())
      .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
      .setColor("PURPLE")
      .addField("Guild Owner",`${guild.owner}(${guild.owner.id})`)
      .addField("Guild Create Date", `${guild.createdAt}(${prettyms(Date.now() - guild.createdTimestamp, {verbose: true})} ago)`)
      .addField("Members", `Users: ${usercount}, Bots: ${botcount} (Total ${guild.members.cache.size}) \n\nOnline: ${onlinecount}, Idle: ${idlecount}, DND: ${dndcount} (Total ${onlinecount + idlecount + dndcount}) \nOffline: ${offlinecount} \n\nDesktop: ${desktopcount}, Mobile: ${mobilecount}, Web: ${webcount}`, true)
      .addField("Channels", channels, true)
      .addField("Roles", guild.roles.cache.size, true)
      .addField("Emojis", guild.emojis.cache.size, true)
      .addField("Features", features < 1 ? "None" : features.join(', '), true)
      message.guild.banner ? guildEmbed.setImage(message.guild.bannerURL()) : false

    message.channel.send(guildEmbed);
  }
};
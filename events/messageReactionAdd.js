const Guild = require("../schemas/guild.js");

module.exports = {
  execute(bot, reaction, user) {
    Guild.findOne({ guildID: reaction.message.guild.id }, (err, guild) => {
      if (err) return console.log(`An error occured while fetching database: ${err}`);
      if (guild) {
        let channel = guild.reactionroles.get(reaction.message.channel.id)
        if (channel) {
          let msg = channel[reaction.message.id]
          if (msg) {
            let roleid = msg[reaction._emoji.id] || msg[reaction._emoji.name] || false
            if (roleid) {
              if (reaction.message.guild.roles.cache.get(roleid)) {
                reaction.message.guild.members.cache.get(user.id).roles.add(roleid)
                user.send({embed: {description: `:white_check_mark: | You have been given **${reaction.message.guild.roles.cache.get(roleid).name}** on **${reaction.message.guild.name}** with your ${reaction._emoji.toString()} reaction.`}})
              } else {
                reaction.message.author.send(`:x: | Role could not be added because it might be deleted from the server! Please contract a manager and tell them to execute this command \`g!reactionroles remove ${reaction._emoji.toString()}\``)
              }
              
            }
          }
        }
      }
    })
  }
}
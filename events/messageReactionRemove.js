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
                reaction.message.guild.members.cache.get(user.id).roles.remove(roleid)
                user.send({embed: {description: `:white_check_mark: | You have been taken away **${reaction.message.guild.roles.cache.get(roleid).name}** on **${reaction.message.guild.name}** with you removing your ${reaction._emoji.toString()} reaction.`}})
              } else {
                user.send({embed: {description: `You removed your ${reaction._emoji.toString()} reaction in **${reaction.message.guild.name}** to remove your role but role is already deleted. Please contract a manager and tell them to execute this command \`g!reactionroles remove ${reaction._emoji.toString()}\``}})
              }
            }
          }
        }
      }
    })
  }
}
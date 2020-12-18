const Guild = require('../schemas/guild.js');

module.exports = async (client, reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  Guild.findOne({ guildID: reaction.message.guild.id }, (err, guild) => {
    if (err) return console.log(`messageReactionAdd: There was a error while fetching the database: ${err}`);
    if (!guild) require("../utility/addguild.js")(reaction.message.guild);
    if (guild) {
      if (guild.reactionroles.get(reaction.message.channel.id)) {
        Object.entries(guild.reactionroles.get(reaction.message.channel.id)).forEach(messages => {
          Object.entries(messages[1]).forEach(emoji => {
            if ((reaction._emoji.id != null ? reaction._emoji.id : reaction._emoji.toString()) === emoji[0]) {
              if (reaction.message.guild.roles.cache.get(emoji[1])) {
                reaction.message.guild.members.cache.get(user.id).roles.add(emoji[1]).then(() => {
                  user.send({embed: {description: `<:tick:724048990626381925> | You have been given **${reaction.message.guild.roles.cache.get(emoji[1]).name}** on **${reaction.message.guild.name}** with your ${reaction._emoji.toString()} reaction.`}})
                }).catch(err => {
                  user.send({embed: {description: `<:cross:724049024943915209> | **${reaction.message.guild.roles.cache.get(emoji[1]).name}** could not be given to you on **${reaction.message.guild.name}** with your ${reaction._emoji.toString()} reaction, here is the error: ${err}`}})
                })
              }
            }
          })
        })
      }
    }
  })
}

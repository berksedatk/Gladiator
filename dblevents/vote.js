const { MessageEmbed } = require("discord.js");
const { channels } = require("../config.json");

module.exports = {
  execute(bot, dbl, vote) {
    let user = bot.users.cache.get(vote.user)
    const voteEmbed = new MessageEmbed()
    .setAuthor(user.tag, user.avatarURL())
    .setDescription('Just voted for the bot!')
    .setFooter('Vote by using g!vote command.')
    .setColor("GOLD")
    .setTimestamp()
    bot.channels.cache.get(channels.voteChannel).send(voteEmbed)
    console.log(`Top.gg - User ${user.tag} just voted!`);
    try {
      user.send(`Thanks for voting! You can vote again in 12 hours.`)
    } catch(err) {
      console.log(`Could not DM the voter: ` + err)
    }
  }
}

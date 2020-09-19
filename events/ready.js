const config = require('../config.json');
const mongoose = require('mongoose');

const Mute = require("../schemas/mute.js");
const Guild = require('../schemas/guild.js');

module.exports = async client => {

  //DBL
  const DBL = require('dblapi.js');
  const dbl = new DBL(process.env.DBL_TOKEN, { webhookPort: 3000, webhookAuth: 'homework' });

  //Stats
  dbl.postStats(client.guilds.cache.size)

  //Voting
  dbl.webhook.on('ready', hook => {
    console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
  });

  dbl.webhook.on('vote', vote => {
    const user = client.users.cache.get(vote.user)
    if (user) {
      client.channels.cache.get("673867340810551342").send({
        embed: {
          author: {
            name: user.tag,
            icon: user.avatarURL()
          },
          description: "Just voted for the bot!",
          footer: {
            text: "Vote by using g!vote command."
          },
          color: "GOLD",
          timestamp: Date.now()
        }
      })
      user.send("Thanks for voting! You can vote again in 12 hours!").then(() => {
        console.log(`${user.tag} voted for the bot!`)
      }).catch(err => {
        console.log(`${user.tag} voted for the bot! But could not be messaged.`)
      })
    } else {
      client.channels.cache.get("673867340810551342").send({
        embed: {
          author: {
            name: vote.user,
          },
          description: "Just voted for the bot!",
          footer: {
            text: "Vote by using g!vote command."
          },
          color: "GOLD",
          timestamp: Date.now()
        }
      })
      console.log(`${user.tag} voted for the bot! But could not find it user cache.`)
    }
  });

  //User activity
  client.user.setActivity("Google Chrome | g!help", {
    type: "PLAYING"
  });

  //Mutes
  setInterval(function() {
    Mute.find({}, (err, mutes) => {
      mutes.forEach(mute => {
        if (mute.time != undefined && Date.now() > mute.time) {
          mute.delete().then(() => {
            try {
              client.guilds.cache.get(mute.guildID).members.cache.get(mute.userID).roles.remove(mute.role)
            } catch(err) {
              console.log(`Could not remove the mute! ${client.guilds.cache.get(mute.guildID).name} -> ${client.guilds.cache.get(mute.guildID).members.cache.get(mute.userID).user.tag}`)
            }
          })
        }
      })
    })
  }, 10000)

  //Client info
  console.log(`Discord - Bot is ready.
  Client User: ${client.user.tag}
  Guild Count: ${client.guilds.cache.size}
  User Count: ${client.users.cache.size}`);

  client.ready = true
};

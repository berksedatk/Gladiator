const Discord = require("discord.js");

module.exports = {
  name: "nickname",
  category: "Moderation",
  description: "Change nickname of members. Leave blank to reset nickname.",
  aliases: ["setnick","nick"],
  usage: "<user - role> [new nickname]",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ["MANAGE_NICKNAMES"],
  async execute(bot, message, args) {

    if (!args[0]) return message.channel.send(":x: | You didn't provided a user or a role.");

    //User
    let user = message.mentions.users.first() ? message.mentions.users.first()
      : (message.guild.members.cache.get(args[0]) ? message.guild.members.cache.get(args[0])
      : (message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(args[0].toLowerCase())).size > 0 ? message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(args[0].toLowerCase())).array()
      : undefined ))

    if (user) {
      if (user.length > 1) {
        let usermsg = "";
          for (let i = 0; i < (user.length > 10 ? 10 : user.length); i++) {
        usermsg += `\n${i + 1} -> ${user[i].user.username}`;
        }

        let msg = await message.channel.send("", {embed: {description: `**There are multiple users found with name '${args[0]}', which one would you like to use?** \n${usermsg}`, footer: {text: "You have 30 seconds to respond."}, timestamp: Date.now()}});
        let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 })
        if (!collected.first()) return message.channel.send(":x: | Command timed out.")
        if (Number(collected.first().content) > user.length) return message.channel.send(":x: | Invalid user number. Command cancelled.");
        user = user[collected.first().content - 1]
        msg.delete()
      } else {
        user = user[0] || user
      }
    }

    let role = message.mentions.roles.first() ? message.mentions.roles.first() : undefined

    args.shift();
    let nick = args.join(" ");
    if (nick.length >= 32) return message.channel.send(":x: | Nickname must be 32 or fewer in lenght.");

    if (user && !role) {
      //User

      if (!message.guild.members.cache.get(user.id).manageable && user.id != bot.user.id) return message.channel.send(":x: | This user is way too powerful than me.");
      user.setNickname(nick, "Requested by " + message.author.username).then(() => {
        if (nick.length < 1) {
          return message.channel.send(`:white_check_mark: | **${user.user.tag}**'s nickname has been cleared succesfully.`);
        } else {
          return message.channel.send(`:white_check_mark: | **${user.user.tag}**'s nickname has been changed to **${nick}** succesfully.`);
        }
      }).catch(err => {
        return message.channel.send("An error occured: " + err)
      })

    } else if (!user && role) {
      //Role

      let msg = await message.channel.send("Changing nicknames...")

      let count = 0;
      let failed = 0;

      while (count + failed < message.guild.members.cache.size) {
        await message.guild.roles.cache.get(role.id).members.forEach(async member => {
          if (message.guild.members.cache.get(member.id).manageable) {
            await member.setNickname(nick, "Requested by " + message.author.tag).then(() => {
              count += 1
            }).catch(() => {
              failed += 1;
            })
          } else {
            failed += 1;
          }
        })
      }

      if (nick.length < 1) {
        msg.edit(`:white_check_mark: | Nickname of **${count}** member(s) who have the role of **${role.name}** cleared, **${failed}** member(s) failed.`)
      } else {
        msg.edit(`:white_check_mark: | Nickname of **${count}** member(s) who have the role of **${role.name}** changed to **${nick}**, **${failed}** member(s) failed.`)
      }

    } else {
      return message.channel.send(":x: | You didn't provide true information. Provide a user or a role.");
    }
  }
};

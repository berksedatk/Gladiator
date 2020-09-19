const Discord = require("discord.js");
const Guild = require("../../schemas/guild.js");
const find = require("../../find.js");

module.exports = {
  name: "leveledroles",
  category: "Leveling",
  description: "Add or remove leveled roles",
  aliases: ["lr"],
  usage: "<xp - level> <list - add - remove> [xp - level] [role]",
  examples: "g!leveledroles xp add 2500 @Trainee\ng!leveledroles level add 10 @Level 10\ng!leveledroles xp 5000",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_GUILD'],
  botPermissions: ['MANAGE_ROLES'],
  execute(bot, message, args) {
    if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You have to provide a option, `level, xp`")
    Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)");
      if (guild) {
        if (args[0].toLowerCase() == "level") {
          if (!args[1]) {
            //List leveled roles
            let levelmsg = []
            levelmsg.push(`To add new leveled level roles, use \`${message.prefix}leveledroles level add <level> <role>\` command.

            **Level - Role**`)
            guild.settings.leveling.roles.level.forEach((role, level) => {
              levelmsg.push(`\`${level}\` -> <@&${role}>`)
            })

            if (levelmsg.length < 1) levelmsg.push("None")

            const levelembed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor("#bc93ed")
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
            .setTitle("Leveled Level Roles List")
            .setDescription(levelmsg)
            message.channel.send(levelembed)
          } else if (args[1].toLowerCase() == "add") {
            //Add leveled role
            if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You need to provide a level to add a role onto. Usage `g!leveledroles level add <level> <role>`");
            if (args[2] > 100 || args[2] < 1) return message.channel.send("<:cross:724049024943915209> | I do not suggest you to use levels that are higher than 100 and below 1. Sorry.");

            let role = await find.role(bot, message, args[3])
            if (!role) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true role.");

            if (guild.settings.leveling.roles.level.get(args[2])) {
              if (guild.settings.leveling.roles.level.get(args[2]) === role.id) return message.channel.send("<:cross:724049024943915209> | This role is already set up for this level.");
            } else {
              guild.settings.leveling.roles.level.set(args[2], role.id)
            }

            await guild.save().then(() => message.channel.send({embed: {description: `<:tick:724048990626381925> | ${role} has been set for level \`${args[2]}\` as a leveled role.`}})).catch(err => message.channel.send(`An error occured: ${err}`))

          } else if (args[1].toLowerCase() == "remove") {
            //Remove leveled role
            let level = (args[2] <= 100 && args[2] > 0) ? args[2] : false
            if (!level) return message.channel.send("<:cross:724049024943915209> | You need to provide a level.");

            let role = guild.settings.leveling.roles.level.get(level)

            if (!role) return message.channel.send("<:cross:724049024943915209> | This level does not have any roles set.");

            guild.settings.leveling.roles.level.set(level, undefined)
            await guild.save().then(() => message.channel.send({embed: {description: `<:tick:724048990626381925> | <@&${role}> has been removed from the level \`${level}\`.`}})).catch(err => message.channel.send(`An error occured: ${err}`))

          }
        } else if (args[0].toLowerCase() == "xp") {
          if (!args[1]) {
            //List leveled roles
            let xpmsg = []
            xpmsg.push(`To add new leveled xp roles, use \`${message.prefix}leveledroles xp add <xp> <role>\` command.

            **Xp - Role**`)
            guild.settings.leveling.roles.xp.forEach((role, xp) => {
              xpmsg.push(`\`${xp}\` -> <@&${role}>`)
            })

            if (xpmsg.length < 1) xpmsg.push("None")

            const xpembed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor("#bc93ed")
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
            .setTitle("Leveled Xp Roles List")
            .setDescription(xpmsg)
            message.channel.send(xpembed)
          } else if (args[1].toLowerCase() == "add") {
            //Add leveled role
            if (!args[2]) return message.channel.send("<:cross:724049024943915209> | You need to provide a level to add a role onto. Usage `g!leveledroles level add <level> <role>`");
            if (args[2] <= 100) return message.channel.send("<:cross:724049024943915209> | I do not suggest you to use xp that is under 100. Sorry.");

            let role = await find.role(bot, message, args[3])
            if (!role) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true role.");

            if (guild.settings.leveling.roles.xp.get(args[2])) {
              if (guild.settings.leveling.roles.xp.get(args[2]) === role.id) return message.channel.send("<:cross:724049024943915209> | This role is already set up for this xp.");
            } else {
              guild.settings.leveling.roles.xp.set(args[2], role.id)
            }

            await guild.save().then(() => message.channel.send({embed: {description: `<:tick:724048990626381925> | ${role} has been set for \`${args[2]} xp\` as a leveled role.`}})).catch(err => message.channel.send(`An error occured: ${err}`))

          } else if (args[1].toLowerCase() == "remove") {
            //Remove leveled role
            let xp = Number(args[2]) ? args[2] : false
            if (!xp) return message.channel.send("<:cross:724049024943915209> | You need to provide a xp.");

            let role = guild.settings.leveling.roles.xp.get(xp)
            if (!role) return message.channel.send("<:cross:724049024943915209> | This xp does not have any roles set.");

            guild.settings.leveling.roles.xp.set(xp, undefined)
            await guild.save().then(() => message.channel.send({embed: {description: `<:tick:724048990626381925> | <@&${role}> has been removed from the \`${xp}xp\`.`}})).catch(err => message.channel.send(`An error occured: ${err}`))

          }
        } else {
          return message.channel.send("<:cross:724049024943915209> | You didn't provide a true option, `level, xp`");
        }
      }
    })
  }
};

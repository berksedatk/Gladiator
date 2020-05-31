const Discord = require('discord.js');
const config = require('../config.json');
const prefixes = config.prefixes;

module.exports = {
  name: 'help',
  category: "General",
  description: "Commands of the bot.",
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  execute(bot, message, args) {
    const categories = {
      "General": [],
      "Fun": [],
      "Utility": [],
      "Leveling": [],
      "Moderation": [],
      "Misc": []
    }
    const keys = Object.keys(categories)
    const {
      commands
    } = message.client;
    let prefix = false;
    for (const thisPrefix of prefixes) {
      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
    }

    if (!args[0]) {
      commands.map(c => {
        if (c.dev || c.unstaged) return
        categories[c.category] ? categories[c.category].push(`\`${c.name}\``) : categories["Misc"].push(`\`${c.name}\``)
      });

      let helpEmbed = new Discord.MessageEmbed()
        .setTitle("Here are the commands:")
        .setDescription(`Use \`${prefix}help <command name>\` to get into a command's details.`)
        .setTimestamp()
        .setFooter("Requested by " + message.author.username, message.author.avatarURL())
        .setColor("BLUE")
      
      keys.forEach(category => {
        if (categories[category][0]) helpEmbed.addField(`${category} Commands:`, categories[category].join(", "))
      })
      
      return message.author.send(helpEmbed)
        .then(() => {
          if (message.channel.type === "dm") return;
          message.react("📩")
        })
        .catch(error => {
          message.reply("It seems like I cant DM you. Please enable your DMs!");
        });
    } else if (args[0]) {
      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

      if (!command) {
        return message.reply(`This command doesn't exists! use \`${prefix}commands\` command to get into commands.`);
      }

      let helpEmbed = new Discord.MessageEmbed()
        .setTitle(`Command name: **${command.name}**`)
        .setColor("#fcffff")
        .setTimestamp()
        .setFooter("Requested by " + message.author.tag, message.author.avatarURL())
        .setDescription("The usage in <> is required, [] is optional.")

      if (command.aliases) helpEmbed.addField("**Aliases:**", command.aliases.join(', '));
      if (command.category) helpEmbed.addField("**Category:**", command.category)
      if (command.description) helpEmbed.addField("**Description:**", command.description);
      if (command.usage) helpEmbed.addField("**Usage:**", prefix + command.name + " " + command.usage);
      if (command.reqPermissions) helpEmbed.addField("**Required Permission(s):**", command.reqPermissions.join(', '));
      if (command.guildOnly) helpEmbed.addField("**Guild Only**", "Command only can be executed in a guild.");
      if (command.dev) helpEmbed.addField("**Dev**", "Only bot owner can execute this command.");
      if (command.voted) helpEmbed.addField("**Voted**", "You have to vote for the bot to use this command.")
      if (command.cooldown) helpEmbed.addField("**Cooldown:**", command.cooldown + " second(s)");
      message.channel.send(helpEmbed)
    }
  }
};

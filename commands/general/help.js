const Discord = require("discord.js");
const fs = require('fs');

function prettyString(string) {
 return string.replace(/_/g, " ").replace(/guild/gi, "Server").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
}

module.exports = {
  name: "help",
  category: "General",
  description: "Shows the list of commands.",
  aliases: ["commands"],
  examples: "g!help embed\ng!commands",
  usage: "[command name]",
  cooldown: 5,
  execute(bot, message, args) {
    const categories = fs.readdirSync('./commands').filter(file => !file.endsWith('.js'));
    const misc = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    if (!args[0]) {

      let helpEmbed = new Discord.MessageEmbed()
      .setTitle("Here are the commands:")
      .setDescription(`Use \`${message.prefix}help <command name>\` to get into a command's details.`)
      .setTimestamp()
      .setFooter("Requested by " + message.author.username, message.author.avatarURL())
      .setColor("BLUE");

      categories.forEach(category => {
        if (category === "dev") return;

        let helpList = [];
        const commands = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));

        commands.forEach(command => {
          command = command.slice(0, command.length-3)
          if (!bot.commands.get(command).dev && !bot.commands.get(command).unstaged) helpList.push(`\`${command}\``);
        });

        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

        helpEmbed.addField(categoryName, helpList.join(", "));
      });

      if (misc.length < 0) {
        let miscList = []
        misc.forEach(c => {
          if (!bot.commands.get(command).dev && !bot.commands.get(command).unstaged) miscList.push(`\`${command}\``)
        })
        helpEmbed.push("Misc.", miscList.join(", "))
      }

      message.channel.send(helpEmbed);
    } else {

      let command = bot.commands.get(args[0].toLowerCase())
      if (!command) return message.channel.send(`<:cross:724049024943915209> | There's no such a command like that, to see the full command list please use \`${message.prefix}commands\` command. `);

      let perms = []
      if (command.reqPermissions) {
        command.reqPermissions.forEach(perm => {
          perms.push(prettyString(perm))
        })
      }
      let helpEmbed = new Discord.MessageEmbed()
      .setTitle(command.name)
      .setFooter("The usage in <> is required, [] is optional. Requested by " + message.author.tag, message.author.avatarURL())
      .setColor("#fffff0")
      if (command.description) helpEmbed.addField("**Description**", command.description);
      if (command.category) helpEmbed.addField("**Category**", command.category, true)
      if (command.aliases) helpEmbed.addField("**Aliases**", command.aliases.join(', '), true);
      if (command.usage) helpEmbed.addField("**Usage**", `\`${message.prefix + command.name} ${command.usage}\``, true);
      if (command.examples) helpEmbed.addField("**Examples**", `\`\`\`${command.examples}\`\`\``);
      if (command.reqPermissions) helpEmbed.addField("**Required Permission(s)**", perms);
      if (command.guildOnly) helpEmbed.addField("**Guild Only**", "Command only can be executed in a server.");
      if (command.dmOnly) helpEmbed.addField("**DM Only**", "Command only can be executed in DMs.");
      if (command.dev) helpEmbed.addField("**Dev**", "Only Bot Developers can execute this command.");
      if (command.voted) helpEmbed.addField("**Voted**", "You have to vote for the bot to use this command.")
      if (command.cooldown) helpEmbed.addField("**Cooldown**", command.cooldown + " second(s)");
      message.channel.send(helpEmbed)
    }
  }
};

const fs = require("fs");

module.exports = (bot) => {
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  for (let i = 0; i < eventFiles.length; i++) {
    const event = require(`../../events/${eventFiles[i]}`);
    const name = eventFiles[i].split(".")[0];
    bot.events.set(name, event);
    bot.on(name, (...args) => bot.events.get(name).execute(bot, ...args));
  }
}

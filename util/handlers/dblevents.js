const fs = require("fs");

module.exports = (bot, db, dbl) => {
  const eventFiles = fs.readdirSync('./dblevents').filter(file => file.endsWith('.js'));
  for (let i = 0; i < eventFiles.length; i++) {
    const event = require(`../../dblevents/${eventFiles[i]}`);
    const name = eventFiles[i].split(".")[0];
    bot.dblevents.set(name, event);
    dbl.webhook.on(name, (...args) => bot.dblevents.get(name).execute(bot, dbl, ...args));
  }
}

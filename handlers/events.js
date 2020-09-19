const fs = require("fs");

module.exports = (client) => {
  const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
  for (let i = 0; i < eventFiles.length; i++) {
    const event = require(`../events/${eventFiles[i]}`);
    const name = eventFiles[i].split(".")[0];
    client.events.set(name, event);
    client.on(name, (...args) => client.events.get(name)(client, ...args));
  }
}

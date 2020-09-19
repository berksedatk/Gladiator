const fs = require("fs");

module.exports = client => {
  const categories = fs.readdirSync('./commands').filter(file => !file.endsWith('.js'));
  const misc = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  //Categories
  categories.forEach(category => {
    const commands = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
    for (const file of commands) {
      const command = require(`../commands/${category}/${file}`)
      !command.category ? command.category = category : null
      client.commands.set(command.name, command);
    }
  });
  //misc
  misc.forEach(file => {
    const command = require(`../commands/${file}`)
    !command.category ? command.category = "misc" : null
    client.commands.set(command.name, command);
  })
}

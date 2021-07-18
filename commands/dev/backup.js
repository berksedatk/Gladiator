module.exports = {
  name: "backup",
  category: "Dev",
  description: "Starts a manual backup of the database",
  dev: true,
  unstaged: true,
  execute(bot, message, args) {
    console.log('Backup running...')
    message.channel.send('Backup request sent, check console.')
    require("../../utility/backup.js").dbAutoBackUp()
  }
};

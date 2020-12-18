module.exports = {
  name: "backup",
  category: "Dev",
  description: "Starts a manual backup of the database",
  dev: true,
  unstaged: true,
  execute(bot, message, args) {
    require("../../utility/backup.js")(bot)
  }
};

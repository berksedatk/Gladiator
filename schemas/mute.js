const mongoose = require('mongoose');

const muteSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: String,
  user: String,
  guildID: String,
  guild: String,
  time: Number,
  role: String
})

module.exports = mongoose.model("muteSchema", muteSchema)
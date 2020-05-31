const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildName: String,
  guildID: String,
  blacklisted: Boolean,
  settings: {  
    join: {
      role: String,
      botrole: String,
      autorole: Boolean,
      channel: String,
      message: String,
      send: Boolean
    },
    levelup: {
      message: String,
      channel: String,
      send: Boolean
    },    
    blacklist: {
      list: [],
      enabled: Boolean
    },
  },
  members: {
    type: Map,
    of: Object
  },
  levelroles: {
    type: Map,
    of: Object
  },
  xproles: {
    type: Map,
    of: Object
  },
  cases: {
    type: Map,
    of: Object
  },
  reactionroles: {
    type: Map,
    of: Object
  }
});

module.exports = mongoose.model("guildSchema", guildSchema)
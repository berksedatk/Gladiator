const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  guildName: String,
  guildID: String,
  blacklisted: Boolean,
  members: {
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
  },
  logging: {
    type: Map,
    of: Object
  },
  overridePermissions: {
    denied: {
      users: {
        type: Map,
        of: Object
      },
      roles: {
        type: Map,
        of: Object
      },
      channels: {
        type: Map,
        of: Object
      }
    },
    allowed: {
      users: {
        type: Map,
        of: Object
      },
      roles: {
        type: Map,
        of: Object
      },
      channels: {
        type: Map,
        of: Object
      }
    },
    cooldown: {
      type: Map,
      of: String
    }
  },
  settings: {
    join: {
      autorole: {
        enabled: Boolean,
        botroles: [],
        userroles: []
      },
      message: {
        text: {
          enabled: Boolean,
          message: String
        },
        image: {
          enabled: Boolean,
          text: String
        },
        channel: String
      }
    },
    leveling: {
      roles: {
        level: {
          type: Map,
          of: Object
        },
        xp: {
          type: Map,
          of: Object
        }
      },
      levelup: {
        send: Boolean,
        embed: Boolean,
        message: String,
        channel: String
      },
      reward: {
        xp: {
          send: Boolean,
          embed: Boolean,
          message: String,
          channel: String
        },
        level: {
          send: Boolean,
          embed: Boolean,
          message: String,
          channel: String
        }
      },
      options: {
        delay: Number,
        xp: {
          max: Number,
          min: Number
        },
        filter: {
          maxLength: Number,
          minLength: Number,
          repeative: Boolean
        }
      }
    },
    blacklist: {
      commands: [],
      channels: []
    }
  }
});

module.exports = mongoose.model("guilds", guildSchema);

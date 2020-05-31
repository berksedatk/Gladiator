const Discord = require("discord.js");
const prefixes = require("../config.json").prefixes;

module.exports = {
  name: "role",
  category: "Moderation",
  description: "Manage roles",
  usage: "<give-add/remove/delete/new/edit>",
  cooldown: 5,
  guildOnly: true,
  reqPermissions: ['MANAGE_ROLES'],
  async execute(bot, message, args, db) {
    let prefix = false;
    for (const thisPrefix of prefixes) {
      if (message.content.toLowerCase().startsWith(thisPrefix)) prefix = thisPrefix;
    }
    if (!args[0]) {
      //Error
      message.channel.send(":x: | You need to provide a option. `give/add, remove, delete, new, edit`");
    } else if (args[0].toLowerCase() === "give" || args[0].toLowerCase() === "add") {
      //Give user a role
      if (!args[1]) return message.channel.send(":x: | You need to provide a user.");
      //Find user
      let user = message.mentions.users.first() ? message.mentions.users.first() 
        : (bot.users.cache.get(args[1]) ? bot.users.cache.get(args[1])
        : (bot.users.cache.filter(user => user.username.toLowerCase().includes(args[1].toLowerCase())).first() ? bot.users.cache.filter(user => user.username.toLowerCase().includes(args[1].toLowerCase())).first()
        : (args[1].toLowerCase === "mass" ? args[1].toLowerCase === "mass" 
        : null)))
      if (user === null) return message.channel.send(":x: | You didn't provide a true user.");
      
      //Find role
      let role = message.mentions.roles.first() ? message.mentions.roles.first()
      : (message.guild.roles.cache.get(args[2]) ? message.guild.roles.cache.get(args[2])
      : (message.guild.roles.cache.filter(role => role.name.includes(args[2])).size >= 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[2])).array()
      : null))
      
      if (role === null) return message.channel.send(":x: | You didn't provide a true role.");     
      if (role.length > 1) {
        let rolemsg = "";
        for (let i = 0; i < role.length; i++) {
          rolemsg += `\n${i + 1} - ${role[i].name}`
        }
        message.channel.send(`There are multiple roles found with name '${args[2]}', which one would you like to use? ${rolemsg}`)
        await message.channel.awaitMessages(m => m.author.id === message.author.id, { time:15000, max: 1, errors:['time'] }).then(collected => {
          if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
          role = role[collected.first().content - 1]
        }).catch(err => {
          return message.channel.send(":x: | Command cancelled.")
        });
      } else {
        role = role[0] || role
      }
            
      if (!role.editable) return message.channel.send(":x: | I can't manage this role. Sorry.");
      if (message.member.roles.highest.position <= message.guild.roles.cache.find(grole => grole.name.toLowerCase() == role.name.toLowerCase()).position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't manage this role.");
      if (message.guild.members.cache.get(user.id).roles.cache.has(role.id)) return message.channel.send(":x: | This user already has this role.");
      if (message.guild.members.cache.get(user.id).roles.highest.position > message.guild.members.cache.get(message.author.id).roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't manage this user.");
      
      if (args[1].toLowerCase() === "mass") {
        let count = 0;
        message.guild.members.cache.forEach(member => {
          member.roles.add(role, {reason: `Requested by ${message.author.tag}`}).then(() => count++).catch(err => {
            message.channel.send(`An error occured: ${err}`);
          });
        })
        message.channel.send({embed: {description:`:white_check_mark: | ${role} has been added to \`${count}\` members roles.`}});
      } else {
        message.guild.members.cache.get(user.id).roles.add(role, {reason: `Requested by ${message.author.tag}`}).then(() => {
          message.channel.send({embed: {description:`:white_check_mark: | ${role} has been added to ${user}'s roles.`}});
        }).catch(err => {
          message.channel.send(`An error occured: ${err}`);
        });
      }     
    } else if (args[0].toLowerCase() === "remove") {
      //Remove a role from user
      let user = message.mentions.users.first() ? message.mentions.users.first() 
      : (bot.users.cache.get(args[1]) ? bot.users.cache.get(args[1])
      : (bot.users.cache.filter(user => user.username.includes(args[1])).first() ? bot.users.cache.filter(user => user.username.includes(args[1])).first()
      : null))
      if (user === null) return message.channel.send(":x: | You didn't provide a true user.");
      
      //Find role
      let role = message.mentions.roles.first() ? message.mentions.roles.first()
      : (message.guild.roles.cache.get(args[2]) ? message.guild.roles.cache.get(args[2])
      : (message.guild.roles.cache.filter(role => role.name.includes(args[2])).size >= 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[2])).array()
      : null))
      
      if (role === null) return message.channel.send(":x: | You didn't provide a true role.");
      if (role.length > 1) {
        let rolemsg = "";
        for (let i = 0; i < role.length; i++) {
          rolemsg += `\n${i + 1} - ${role[i].name}`
        }
        message.channel.send(`There are multiple roles found with name '${args[2]}', which one would you like to use? ${rolemsg}`)
        await message.channel.awaitMessages(m => m.author.id === message.author.id, { time:15000, max: 1, errors:['time'] }).then(collected => {
          if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
          role = role[collected.first().content - 1]
        }).catch(err => {
          return message.channel.send(":x: | Command cancelled.")
        });
      } else {
        role = role[0]  || role
      }
      
      if (!role.editable) return message.channel.send(":x: | I can't manage this role. Sorry.");
      if (!message.guild.members.cache.get(user.id).roles.cache.has(role.id)) return message.channel.send(":x: | This user doesn't have that role.");
      if (message.member.roles.highest.position <= message.guild.roles.cache.find(grole => grole.name.toLowerCase() == role.name.toLowerCase()).position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't manage this role.");
      if (message.guild.members.cache.get(user.id).roles.highest.position > message.guild.members.cache.get(message.author.id).roles.highest.position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't manage this user.");
      
      message.guild.members.cache.get(user.id).roles.remove(role, {reason: `Requested by ${message.author.tag}`}).then(() => {
        message.channel.send({embed: {description:`:white_check_mark: | ${role} has been removed from ${user}'s roles.`}});
      }).catch(err => {
        message.channel.send(`An error occured: ${err}`);
      });
    } else if (args[0].toLowerCase() === "delete") {
      //Delete a role
      
      //Find role
      let role = message.mentions.roles.first() ? message.mentions.roles.first()
      : (message.guild.roles.cache.get(args[1]) ? message.guild.roles.cache.get(args[1])
      : (message.guild.roles.cache.filter(role => role.name.includes(args[1])).size > 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[1])).array()
      : null))
      
      if (role === null) return message.channel.send(":x: | You didn't provide a true role.");
      if (role.length > 1) {
        let rolemsg = "";
        for (let i = 0; i < role.length; i++) {
          rolemsg += `\n${i + 1} - ${role[i].name}`
        }
        message.channel.send(`There are multiple roles found with name '${args[1]}', which one would you like to use? ${rolemsg}`)
        await message.channel.awaitMessages(m => m.author.id === message.author.id, { time:15000, max: 1, errors:['time'] }).then(collected => {
          if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
          role = role[collected.first().content - 1]
        }).catch(err => {
          return message.channel.send(":x: | Command cancelled.")
        });
      } else {
        role = role[0] || role
      }
      
      if (!role.editable) return message.channel.send(":x: | I can't manage this role. Sorry.");
      if (message.member.roles.highest.position <= message.guild.roles.cache.find(grole => grole.name.toLowerCase() == role.name.toLowerCase()).position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't manage this role.");
      
      message.guild.roles.cache.get(role.id).delete(`Requested by ${message.author.tag} `).then(() => {
        message.channel.send({embed: {description:`:white_check_mark: | ${role.name} has been removed from the server successfully.`}});
      }).catch(err => {
        message.channel.send(`An error occured: ${err}`);
      });
    } else if (args[0].toLowerCase() === "new") {
      //Adds a new role
      if (!args[1]) {
        return message.channel.send("You need to provide a name for your role.\n Usage example of the command: `g!role new name:foo color:#03eeff mention:true hoist:false` you dont need to provide anything other than the name.")
      } else if (args[1]) {
        //Check for the specified things
        let name = false
        let color = false
        let mention = false
        let hoist = false
        
        args.shift()
        args.forEach(arg => {
          name = arg.indexOf("name:") != -1 ? arg.slice(arg.indexOf("name:") + 5) : name
          color = arg.indexOf("color:") != -1 ? arg.slice(arg.indexOf("color:") + 6) : color
          mention = arg.indexOf("mention:") != -1 ? arg.slice(arg.indexOf("mention:") + 8) : mention
          hoist = arg.indexOf("seperate:") != -1 ? arg.slice(arg.indexOf("seperate:") + 9) : hoist
        })
        
        if (!name) return message.channel.send(":x: | You need a name for the role! To see the right format use the `g!role new` command");
        if (!/^#[0-9A-F]{6}$/i.test(color) && color) return message.channel.send(":x: | You didnt provide a true hex color.");
        if (mention != "true" && mention != "false" && mention) return message.channel.send(":x: | You didnt provide a true option for mention. `true, false`")
        if (hoist != "true" && hoist != "false" && hoist) return message.channel.send(":x: | You didnt provide a true option for seperate. `true, false`")
        
        message.guild.roles.create({
          data: {
            name: name,
            color: color ? color : "000000",
            hoist: hoist,
            mentionable: mention
          }
        }).then(role => {
          return message.channel.send({embed: {description: `:white_check_mark: | ${role} role has been successfully created.`}})
        })
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (args[0].toLowerCase() === "edit") {
      //Edits a role
      //Find role
      let role = message.mentions.roles.first() ? message.mentions.roles.first()
      : (message.guild.roles.cache.get(args[1]) ? message.guild.roles.cache.get(args[1])
      : (message.guild.roles.cache.filter(role => role.name.includes(args[1])).size > 1 ? message.guild.roles.cache.filter(role => role.name.includes(args[1])).array()
      : null))
      
      if (role === null) return message.channel.send(":x: | You didn't provide a true role.");
      if (role.length > 1) {
        let rolemsg = "";
        for (let i = 0; i < role.length; i++) {
          rolemsg += `\n${i + 1} - ${role[i].name}`
        }
        message.channel.send(`There are multiple roles found with name '${args[1]}', which one would you like to use? ${rolemsg}`)
        await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 15000, max: 1, errors:['time'] }).then(collected => {
          if (Number(collected.first().content) > role.length) return message.channel.send(":x: | Invalid role number. Command cancelled.");
          role = role[collected.first().content - 1]
        }).catch(err => {
          return message.channel.send(":x: | Command cancelled.")
        });
      } else {
        role = role[0] || role
      }
        
      if (!role.editable) return message.channel.send(":x: | I can't manage this role. Sorry.");
      if (message.member.roles.highest.position <= message.guild.roles.cache.find(grole => grole.name.toLowerCase() == role.name.toLowerCase()).position && message.guild.owner.id != message.author.id) return message.channel.send(":x: | You can't manage this role.");
      
      if (!args[2]) {
        //Error
        return message.channel.send(":x: | You have to provide a option. `color, seperated/hoisted, mentionable, permissions`")
      } else if (args[2].toLowerCase() === "color") {
        //Change the color
        if (!args[3]) return message.channel.send(":x: | You need to provide a hex color.");
        if (/^#[0-9A-F]{6}$/i.test(args[3]) === false) return message.channel.send(":x: | You need to provide a true hex color.");
        role.setColor(args[3], { reason: `Requested by ${message.author.tag}` }).then(() => {
          return message.channel.send({embed: {description:`:white_check_mark: | ${role}'s color has been changed to ${args[3]}.`}})
        }).catch(err => {
          return message.channel.send(`An error occured: ${err}`);
        })
      } else if (args[2].toLowerCase() === "mentionable") {
        //Set it seperate or not
        if (!args[3]) return message.channel.send(":x: | You need to decide. `true, false`");
        if ((args[3] === "true") === role.mentionable) return message.channel.send(`:x: | Its already set to \`${role.mentionable}\`!`);
        role.setMentionable((args[3] === "true"), { reason: `Requested by ${message.author.tag} `}).then(() => {
          return message.channel.send({embed: {description:`:white_check_mark: | ${role}'s mention has been changed to \`${args[3].toLowerCase()}\` successfully.`}})
        }).catch(err => {
          return message.channel.send(`An error occured: ${err}`);
        })
      } else if (args[2].toLowerCase() === "seperated" || args[2].toLowerCase() === "hoisted" ) {
        //Set it mentionable or not
        if (!args[3]) return message.channel.send(":x: | You need to decide. `true, false`");
        if ((args[3] === "true") === role.hoist) return message.channel.send(`:x: | Its already set to \`${role.hoist}\`!`);
        role.setHoist((args[3] === "true"), { reason: `Requested by ${message.author.tag} `}).then(() => {
          return message.channel.send({embed: {description:`:white_check_mark: | ${role}'s hoist has been changed to \`${args[3].toLowerCase()}\` successfully.`}})
        }).catch(err => {
          return message.channel.send(`An error occured: ${err}`);
        })
      } else if (args[2].toLowerCase() === "permissions") {
        //Add, remove permissions
        if (!args[3]) {
          //Error - info
          return message.channel.send(":x: | You must provide a option. `flags, add, remove`");
        } else if (args[3].toLowerCase() === "flags") {
          //Send info about permissions
          return message.channel.send("To add a permission you need to provide it's permission flag, to add multiple at once just seperate them with space. \nHere are the flags for permissions: ```ADMINISTRATOR (implicitly has all permissions, and bypasses all channel overwrites) \nCREATE_INSTANT_INVITE (create invitations to the guild) \nKICK_MEMBERS \nBAN_MEMBERS \nMANAGE_CHANNELS (edit and reorder channels) \nMANAGE_GUILD (edit the guild information, region, etc.) \nADD_REACTIONS (add new reactions to messages) \nVIEW_AUDIT_LOG \nPRIORITY_SPEAKER \nSTREAM \nVIEW_CHANNEL \nSEND_MESSAGES \nSEND_TTS_MESSAGES \nMANAGE_MESSAGES (delete messages and reactions) \nEMBED_LINKS (links posted will have a preview embedded) \nATTACH_FILES \nREAD_MESSAGE_HISTORY (view messages that were posted prior to opening Discord) \nMENTION_EVERYONE \nUSE_EXTERNAL_EMOJIS (use emojis from different guilds) \nVIEW_GUILD_INSIGHTS \nCONNECT (connect to a voice channel) \nSPEAK (speak in a voice channel) \nMUTE_MEMBERS (mute members across all voice channels) \nDEAFEN_MEMBERS (deafen members across all voice channels) \nMOVE_MEMBERS (move members between voice channels) \nUSE_VAD (use voice activity detection) \nCHANGE_NICKNAME \nMANAGE_NICKNAMES (change other members' nicknames) \nMANAGE_ROLES \nMANAGE_WEBHOOKS \nMANAGE_EMOJIS```")
        } else if (args[3].toLowerCase() === "add") {
          //Add permission
          if (!args[4]) return message.channel.send(`:x: | You need to provide a permission flag, see them in \`${prefix}role edit <role> permissions flags\`.`)
          const permargs = args.splice(4)
          if (role.permissions.has(permargs)) return message.channel.send(':x: | The role has this permission already!');
          try {
            let permissions = new Discord.Permissions(permargs)
            permissions.add(role.permissions.bitfield)
            role.setPermissions(permissions).then(() => {
              return message.channel.send({embed: {description:`:white_check_mark: | ${role}'s permissions have been updated.`}})
            })           
          } 
          catch(err) {
            return message.channel.send(":x: | Invalid permission flag, command cancelled.")
          }  
        } else if (args[3].toLowerCase() === "remove") {
          //Remove permission
          if (!args[4]) return message.channel.send(`:x: | You need to provide a permission flag, see them in \`${prefix}role edit <role> permissions flags\`.`)
          const permargs = args.splice(4)
          if (!role.permissions.has(permargs)) return message.channel.send(':x: | The role does not have this permission.');
          try {
            let permissions = new Discord.Permissions(permargs)
            permissions = role.permissions.remove(permissions)
            role.setPermissions(permissions).then(() => {
              return message.channel.send({embed: {description:`:white_check_mark: | ${role}'s permissions have been updated.`}})
            })       
          } 
          catch(err) {
            return message.channel.send(":x: | Invalid permission flag, command cancelled.")
          }
        } else {
          //Error
          return message.channel.send(":x: | You must provide a true option. `info(for flags), add, remove`");
        }
      } else {
        //Error
        return message.channel.send(":x: | You have to provide true a option. `color, seperated/hoisted, mentionable, permissions`")
      }
    } else {
      //Error
      return message.channel.send(":x: | You need to provide a true option. `give/add, remove, delete, new, edit`");
    }
  }
};
const Discord = require("discord.js");
const Canvas = require("canvas");
const config = require("../config.json");
const Guild = require("../schemas/guild.js");
const mongoose = require("mongoose");

const applyText = (canvas, text) => {
  const ctx = canvas.getContext("2d");
  let fontSize = 50;

  do {
    ctx.font = `${(fontSize -= 10)}px sans-serif`;
  } while (ctx.measureText(text).width > canvas.width - 300);
  return ctx.font;
};

const colors = [
  "red",
  "blue",
  "lightblue",
  "green",
  "grey",
  "lightgrey",
  "yellow",
  "orange"
];

module.exports = {
  name: "profile",
  category: "Leveling",
  description: "Your profile and your level.",
  aliases: ["xp", "level", "rank", "p"],
  usage: "[user]",
  guildOnly: true,
  cooldown: 5,
  execute(bot, message, args, db) {
    let user;
    Guild.findOne({ guildID: message.guild.id }, (err, guild) => {
      if (err) return message.channel.send(`An error occured: ${err}`);
      if (!guild) return message.channel.send("There was an error while fetching server database, please contact a bot dev! (https://discord.gg/tkR2nTf)")
      if (guild) {
        if (args[0]) {
          if (args[0].toLowerCase() === "set") {
            if (!args[1]) {
              //Error
              return message.channel.send("You didn't provide a operation. `color, lightmode, darkmode`");
            } else if (args[1].toLowerCase() === "color") {
              //Change color
              if (!args[2]) return message.channel.send("You must provide a color, the color can be chosen from the list below or you can use a hex code.\n" +colors.join(", "));
              if (!colors.includes(args[2].toLowerCase()) && /^#[0-9A-F]{6}$/i.test(args[2]) === false) return message.channel.send("You must pick a color from list or use a hex code which includes 6 letters(ex. #A1B2C3).\n" +colors.join(", "));
              let color = args[2];
              
              guild.members.set(message.author.id, {
                username: guild.members.get(message.author.id).username,
                id: guild.members.get(message.author.id).id,
                xp: guild.members.get(message.author.id).xp,
                level: guild.members.get(message.author.id).level,
                lastxpmessage: message.createdTimestamp,
                color: args[2],
                mode: "dark"
              });
              guild.save().then(() => message.channel.send({embed: {description:`Color of your profile has been changed successfully.`, color: args[2]}})).catch(err => message.channel.send(`An error occured: ${err}`))
            } else if (args[1].toLowerCase() === "lightmode") {
              //Light mode
              
              guild.members.set(message.author.id, {
                username: guild.members.get(message.author.id).username,
                id: guild.members.get(message.author.id).id,
                xp: guild.members.get(message.author.id).xp,
                level: guild.members.get(message.author.id).level,
                lastxpmessage: message.createdTimestamp,
                color: guild.members.get(message.author.id).color,
                mode: "light"
              });
              guild.save().then(() => message.channel.send('Successfully switched to the lightmode.')).catch(err => message.channel.send(`An error occured: ${err}`))
            } else if (args[1].toLowerCase() === "darkmode") {
              //Dark mode
              
              guild.members.set(message.author.id, {
                username: guild.members.get(message.author.id).username,
                id: guild.members.get(message.author.id).id,
                xp: guild.members.get(message.author.id).xp,
                level: guild.members.get(message.author.id).level,
                lastxpmessage: message.createdTimestamp,
                color: guild.members.get(message.author.id).color,
                mode: "dark"
              });
              guild.save().then(() => message.channel.send('Successfully switched to the darkmode.')).catch(err => message.channel.send(`An error occured: ${err}`))
            } else {
              //Error
              return message.channel.send("You didn't provide a true operation. `color, lightmode, darkmode`");
            }
          } else {
            //Send user's profile
            user = message.mentions.users.first() ? message.mentions.users.first() 
            : (bot.users.cache.get(args[0]) ? bot.users.cache.get(args[0])
            : (bot.users.cache.filter(user => user.username.toLowerCase().includes(args[0].toLowerCase())).first() ? bot.users.cache.filter(user => user.username.toLowerCase().includes(args[0].toLowerCase())).first()
            : null))
            
            if (user === null) return message.channel.send(":x: | You didn't provide a true user.");
            getUser(user, guild)
          }
        } else {
          //Send author's profile
          user = message.author;
          getUser(user, guild)
        }
      }
    });
    
    function getUser(user, guild) {
      if (user.bot) return message.channel.send(":x: | Bots doesn't has profiles. They are too metalic for that.");
      let xp;
      let level;
      let color;
      let mode;
      if (guild.members.get(user.id)) {
        xp = guild.members.get(user.id).xp
        level = guild.members.get(user.id).level
        color = guild.members.get(user.id).color
        mode = guild.members.get(user.id).mode
        createCanvas(xp, level, color, mode)
      } else {
        guild.members.set(message.author.id, {
          username: user.tag,
          id: user.id,
          xp: 0,
          level: 0,
          lastxpmessage: 0,
          color: "lightblue",
          mode: "dark"
        });
        guild.save().catch(err => message.channel.send(`An error occured: ${err}`))
        xp = 0
        level = 0
        color = "lightblue"
        mode = "dark"
        createCanvas(xp, level, color, mode)
      }      
    }

    async function createCanvas(xp, level, color, mode) {
      let background;
      let textcolor;
      if (mode === "dark") {
        background = "#27272b";
        textcolor = "white";
      } else {
        background = "white";
        textcolor = "#27272b";
      }

      let levelup = 560 * (level + 1);
      let percent = (xp / levelup) * 100;
      let bar = (350 * percent) / 100;

      const canvas = Canvas.createCanvas(700, 250);
      const ctx = canvas.getContext("2d");

      ctx.save();
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      //Full image outline
      ctx.save();
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#454547";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      //Text
      ctx.save();
      ctx.font = applyText(
        canvas,
        message.guild.members.cache.get(user.id).displayName
      );
      ctx.fillStyle = textcolor;
      ctx.fillText(message.guild.members.cache.get(user.id).displayName, 280, 110);
      ctx.font = "20px sans-serif";
      ctx.fillText(`${xp} / ${levelup} xp`, 280, 200)
      ctx.textAlign = "right";
      ctx.fillText(`Lvl ${level}`, 610, 200);
      ctx.fillText(message.guild.name, 615, 57);
      ctx.restore();
      
      //Cuttings
      ctx.beginPath();
      ctx.arc(125, 125, 100, 0, Math.PI * 2);
      ctx.moveTo(300, 125);
      ctx.arc(300, 150, 25, (Math.PI * 3) / 2, Math.PI / 2, true);
      ctx.lineTo(300, 175);
      ctx.arc(600, 150, 25, Math.PI / 2, (Math.PI * 3) / 2, true);
      ctx.lineTo(300, 125);
      ctx.moveTo(650, 75);
      ctx.arc(650, 50, 25, Math.PI / 2, (Math.PI * 5) / 2);
      ctx.closePath();
      ctx.clip();

      //Background
      ctx.fillStyle = color;
      ctx.fillRect(25, 25, 200, 200);
      ctx.fillRect(275, 125, bar, 50);
      ctx.fillRect(625, 25, 50, 50);

      //Load the photo
      const photo = await Canvas.loadImage(user.avatarURL({ format: "png" }));
      if (message.guild.iconURL() != null) {
        const icon = await Canvas.loadImage(message.guild.iconURL({ format: "png" })); 
        ctx.drawImage(icon, 627, 27, 46, 46);
      }
      
      //Images    
      ctx.drawImage(photo, 25, 25, 200, 200);

      //Outlines
      ctx.lineWidth = 4;
      ctx.strokeStyle = "grey";
      ctx.stroke();

      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "profile.png");
      
      message.channel.send(attachment);
    }
  }
}
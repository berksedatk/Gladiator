const Discord = require("discord.js");

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function validHex(str) {
  return /^#[0-9A-F]{6}$/i.test(str)
}

function isValidTimestamp(_timestamp) {
    const newTimestamp = new Date(_timestamp).getTime();
    return isNumeric(newTimestamp);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = {
  name: "embed",
  category: "Utility",
  description: "Creates an embed",
  cooldown: 5,
  reqPermissions: ['MANAGE_MESSAGES'],
  async execute(bot, message, args) {
      let author
      let authoricon
      let footer

      //Startup
      let msg = await message.channel.send("Would you like to start the embed creator?");
      let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 15000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() != "yes" && collected.first().content.toLowerCase() != "y") return message.channel.send(":x: | Command cancelled.");
      msg.delete()

      let embed = new Discord.MessageEmbed()
      let embedMsg = await message.channel.send(embed)
      //Author name
      msg = await message.channel.send("Excellent! Lets start off with the top, what do you want the author name to be? \n`skip` for nothing, `cancel` for cancelling the creator.");
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit("Alright, embed wont have a author name then, let's move to the title, what you want title to be? \n`skip` for nothing, `cancel` for cancelling the creator.")
      } else {
        if (collected.first().content.length > 256) return message.channel.send(":x: | Author name cannot exceed 256 characters. Command cancelled.");
        msg.edit(`So the Author name will be ${collected.first().content}, what would you want for author's icon. You need to upload a image or send a link can embed the image! \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`);
        author = collected.first().content
        embed.setAuthor(author)
        embedMsg.edit("", embed)

        //Author icon
        collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
        if (!collected.first()) return message.channel.send(":x: | Command timed out.");
        if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
        if (collected.first().content.toLowerCase() === "skip") {
          msg.edit("The embed won't have a author icon then, what should be the author URL? \n`skip` for nothing, `cancel` for cancelling the creator.");
        } else if (collected.first().attachments.first()) {
          authoricon = collected.first().attachments.first().url
          msg.edit(`Icon will be set to the image you sent, what should be the author URL? \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`);
          embed.setAuthor(author, authoricon)
          embedMsg.edit("", embed)
        } else {
          return message.channel.send(":x: | No image attached, command cancelled.");
        }

        //Author URL
        collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
        if (!collected.first()) return message.channel.send(":x: | Command timed out.");
        if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
        if (collected.first().content.toLowerCase() === "skip") {
          msg.edit("The embed won't have a author URL then, let's move to the title, what you want title to be? \n`skip` for nothing, `cancel` for cancelling the creator.");
        } else {
          if (!validURL(collected.first().content)) return message.channel.send(":x: | That's not a valid URL. Command cancelled.");
          msg.edit(`Author URL is set to ${collected.first().content} now, let's move to the title, what you want title to be? \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`);
          embed.setAuthor(author, authoricon, collected.first().content)
          embedMsg.edit("", embed)
        }
      }
      //Title
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit("There wont be a title on this embed, what do you want the URL to be? You need a valid URL for this. \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (collected.first().content.length > 256) return message.channel.send(":x: | Title cannot exceed 256 characters. Command cancelled.");
        msg.edit(`The title will be ${collected.first().content}, what do you want the URL to be? You need a valid URL for this. \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setTitle(collected.first().content)
        embedMsg.edit("", embed)
      }
      //URL
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit("Then there is no URL for this embed. What you want the description to be? \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (!validURL(collected.first().content)) return message.channel.send(":x: | That's not a valid URL. Command cancelled.");
        msg.edit(`The URL will be ${collected.first().content}, what you want the description to be?  \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setURL(collected.first().content)
        embedMsg.edit("", embed)
      }
      //Description
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit("No description will be given for this embed, then what should be the color? You need a valid Hex code for this(for extra time command will expire in 2 minutes, look up hex codes.) \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (collected.first().content.length > 2048) return message.channel.send(":x: | Description cannot exceed 2048 characters. Command cancelled.");
        msg.edit(`The description will be set to your message, then what should be the color? You need a valid Hex code for this(for extra time command will expire in 2 minutes, look up hex codes.) \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setDescription(collected.first().content)
        embedMsg.edit("", embed)
      }
      //Color
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit("Color will be black as default, what you want the thumbnail image to be? You need to upload a image or send a link can embed the image! \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (!validHex(collected.first().content)) return message.channel.send(":x: | Invalid Hex code. Command cancelled.");
        msg.edit(`The color will be ${collected.first().content}, what you want the thumbnail image to be? You need to upload a image or send a link can embed the image! \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setColor(collected.first().content)
        embedMsg.edit("", embed)
      }
      //Thumbnail
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit("No thumbnail for this embed! Do you want any fields in your embed? \n`yes` for creating fields, `skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (!collected.first().attachments.first()) return message.channel.send(":x: | No image attached. Command cancelled.");
        msg.edit(`Thumbnail will be set to the image you sent! Do you want any fields in your embed? \n\`yes\` for creating fields, \`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setThumbnail(collected.first().attachments.first().url)
        embedMsg.edit("", embed)
      }
      //Fields
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() != "yes") {
        msg.edit("There wont be any fields for this embed, what you want the image to be? You need to upload a image or send a link can embed the image! \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        let count = 1;
        while(count < 25) {
          msg.edit(`Field: ${count}\nWhat should be the field name? \n\`skip\` for moving on to image, \`cancel\` for cancelling the creator.`);
          collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
          if (!collected.first()) return message.channel.send(":x: | Command timed out.");
          if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
          if (collected.first().content.toLowerCase() === "skip") {
            msg.edit("Fields are skipped! Now, what you want the embed's image to be? You need to upload a image or send a link can embed the image! \n`skip` for nothing, `cancel` for cancelling the creator.");
            break;
          } else {
            if (collected.first().content.length > 256) return message.channel.send(":x: | Field name cannot exceed 256 characters. Command cancelled.");
            let fieldname = collected.first().content.toLowerCase()
            msg.edit(`The field name will be ${fieldname}, what should be the field value? \n\`cancel\` for cancelling the creator.`);
            collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
            if (!collected.first()) return message.channel.send(":x: | Command timed out.");
            if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
            if (collected.first().content.length > 2048) return message.channel.send(":x: | Field value cannot exceed 2048 characters. Command cancelled.");
            embed.addField(fieldname, collected.first().content)
            embedMsg.edit("", {embed: embed})
            message.channel.send(`Field ${count} has been set to your embed, you can move onto the next one.`).then(m => m.delete({timeout : 3000}))
            count++;
          }
        }
      }
      //Image
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit("There wont be a image on the embed, what you want your footer text to be? \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else if (collected.first().attachments.first()) {
        msg.edit(`Image has been set to the image you sent, what you want your footer text to be? \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`);
        embed.setImage(collected.first().attachments.first().url)
        embedMsg.edit("", embed)
      } else {
        return message.channel.send(":x: | No image attached, command cancelled.");
      }
      //Footer
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit("Embed wont have a footer then, should the embed have a timestamp? \n`yes` or `no`, `cancel` for cancelling the creator.")
      } else {
        if (collected.first().content.length > 2048) return message.channel.send(":x: | Footer text cannot exceed 2048 characters. Command cancelled.");
        msg.edit(`Footer will be set to your message, what should be the footer icon? You need to upload a image or send a link can embed the image! \n\`skip\` for nothing , \`cancel\` for cancelling the creator.`);
        let footer = collected.first().content
        embed.setFooter(footer)
        embedMsg.edit("", embed)

        //Footer icon
        collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 });
        if (!collected.first()) return message.channel.send(":x: | Command timed out.");
        if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
        if (collected.first().content.toLowerCase() === "skip") {
          msg.edit("Embed wont have a footer icon then, do you want the embed to have a timestamp?. \n`yes` or `no`, `cancel` for cancelling the creator.");
        } else if (collected.first().attachments.first()) {
          msg.edit(`Footer image will be set to the image you sent, do you want the embed to have a timestamp? \n\`yes\` or \`no\`, \`cancel\` for cancelling the creator.`);
          embed.setFooter(footer, collected.first().attachments.first().url)
          embedMsg.edit("", embed)
        } else {
          return message.channel.send(":x: | No image attached, command cancelled.");
        }
      }
      //Timestamp
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "yes") {
        msg.edit("The embed will have a timestamp. \n**All done!** Now you have to mention a **channel** for this embed to be sent. \n`skip` for current channel, `cancel` for cancelling the creator.");
        embed.setTimestamp()
        embedMsg.edit("", embed)
      } else {
        msg.edit("The embed wont have a timestamp. All done! Now you have to mention a channel for this embed to be sent. \n`skip` for current channel, `cancel` for cancelling the creator.")
      }
      //Channel
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      let channel = collected.first().mentions.channels.first() ? collected.first().mentions.channels.first()
      : (collected.first().content.toLowerCase() === "skip" ? collected.first().channel : undefined)
      if (!channel) return message.channel.send(":x: | You didn't mention a channel or type `skip` for current channel. Command cancelled.");
      channel.send(embed).then(() => {
        msg.delete()
        return message.channel.send(`The embed is successfully sent in ${channel}`, embed)
      }).catch(err => {
        return message.channel.send("There was a error while sending the embed: " + err)
      })
  }
};

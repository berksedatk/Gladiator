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
      let collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 30000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() != "yes" && collected.first().content.toLowerCase() != "y") return message.channel.send(":x: | Command cancelled.");
      msg.delete()

      let embed = new Discord.MessageEmbed()
      let embedMsg = await message.channel.send(embed)
      //Author name
      msg = await message.channel.send(":one: - What will be the Author name of this embed? \n`skip` for nothing, `cancel` for cancelling the creator.");
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit(":two: - There won't be a Author for this embed. What will be the Title of this embed? \n`skip` for nothing, `cancel` for cancelling the creator.")
      } else {
        if (collected.first().content.length > 256) return message.channel.send(":x: | Author name cannot exceed 256 characters. Command cancelled.");
        msg.edit(`:one: - :one: - Author name will be ${collected.first().content}. What will be the Author Icon for this embed?. You need to upload a image or send a link can embed the image! \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`);
        author = collected.first().content
        embed.setAuthor(author)
        embedMsg.edit("", embed)

        //Author icon
        collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
        if (!collected.first()) return message.channel.send(":x: | Command timed out.");
        if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
        if (collected.first().content.toLowerCase() === "skip") {
          msg.edit(":one: - :two: - There won't be a Author Icon for this embed. What will be the Author URL for this embed? You need to provide a vaild URL. \n`skip` for nothing, `cancel` for cancelling the creator.");
        } else if (collected.first().attachments.first()) {
          authoricon = collected.first().attachments.first().url
          msg.edit(`:one: - :two: - Author Icon will be set to the image you sent. What will be the Author URL for this embed? You need to provide a vaild URL. \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`);
          embedMsg.edit("", embed)
        } else {
          return message.channel.send(":x: | No image attached, command cancelled.");
        }

        //Author URL
        collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
        if (!collected.first()) return message.channel.send(":x: | Command timed out.");
        if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
        if (collected.first().content.toLowerCase() === "skip") {
          msg.edit(":two: - There won't be a Author URL for this embed. What will be the Title for this embed? \n`skip` for nothing, `cancel` for cancelling the creator.");
        } else {
          if (!validURL(collected.first().content)) return message.channel.send(":x: | That's not a valid URL. Command cancelled.");
          msg.edit(`:two: - Author URL is set to ${collected.first().content}. What will be the Title for this embed? \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`);
          embed.setAuthor(author, authoricon, collected.first().content)
          embedMsg.edit("", embed)
        }
      }
      //Title
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit(":three: - There won't be a Title for this embed. What will be the URL for this embed? You need to provide a valid URL. \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (collected.first().content.length > 256) return message.channel.send(":x: | Title cannot exceed 256 characters. Command cancelled.");
        msg.edit(`:three: - Title will be set to ${collected.first().content}. What will be the URL for this embed? You need to provide a valid URL. \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setTitle(collected.first().content)
        embedMsg.edit("", embed)
      }
      //URL
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit(":four: - There won't be a URL for this embed. What will be the Description for this embed? You can use up to 2048 characters. \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (!validURL(collected.first().content)) return message.channel.send(":x: | That's not a valid URL. Command cancelled.");
        msg.edit(`The URL will be set to ${collected.first().content}. What will be the Description for this embed? You can use up to 2048 characters. \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setURL(collected.first().content)
        embedMsg.edit("", embed)
      }
      //Description
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit(":five: - There won't be a Description for this embed. What will be the Color of this embed? You need to provide a true Hex color. \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (collected.first().content.length > 2048) return message.channel.send(":x: | Description cannot exceed 2048 characters. Command cancelled.");
        msg.edit(`:five: - Description will be set to your message. What will be the Color of this embed? You need to provide a true Hex color. \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setDescription(collected.first().content)
        embedMsg.edit("", embed)
      }
      //Color
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit(":six: - Color will be set to black as default. What will be the Thumbnail of this embed? You need to upload a image or send a link can embed the image. \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (!validHex(collected.first().content)) return message.channel.send(":x: | Invalid Hex code. Command cancelled.");
        msg.edit(`:six: - Color will be set to ${collected.first().content}. What will be the Thumbnail of this embed? You need to upload a image or send a link can embed the image. \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setColor(collected.first().content)
        embedMsg.edit("", embed)
      }
      //Thumbnail
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit(":seven: - There won't be a Thumbnail for this embed. Do you wish to add Fields into your embed? \n`yes` for creating fields, `skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        if (!collected.first().attachments.first()) return message.channel.send(":x: | No image attached. Command cancelled.");
        msg.edit(`:seven : Thumbnail will be set to the image you sent. Do you wish to add Fields into your embed? \n\`yes\` for creating fields, \`skip\` for nothing, \`cancel\` for cancelling the creator.`)
        embed.setThumbnail(collected.first().attachments.first().url)
        embedMsg.edit("", embed)
      }
      //Fields
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() != "yes") {
        msg.edit(":eight: - There won't be any Fields for this embed. What will be the Image for this embed? You need to upload a image or send a link can embed the image. \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else {
        let count = 1;
        while(count < 25) {
          msg.edit(`:seven: - :one: - Field: ${count}\nWhat should be the Field Name? You can use up to 256 characters. \n\`skip\` for moving on to Image, \`cancel\` for cancelling the creator.`);
          collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
          if (!collected.first()) return message.channel.send(":x: | Command timed out.");
          if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
          if (collected.first().content.toLowerCase() === "skip") {
            msg.edit(":eight: - Fields are skipped. What will be the Image for this embed? You need to upload a image or send a link can embed the image!. \n`skip` for nothing, `cancel` for cancelling the creator.");
            break;
          } else {
            if (collected.first().content.length > 256) return message.channel.send(":x: | Field name cannot exceed 256 characters. Command cancelled.");
            let fieldname = collected.first().content
            msg.edit(`:seven: - :two: - The Field Name will be set to ${fieldname}. What will be the Field Value for this Field? You can use up to 2048 characters. \n\`cancel\` for cancelling the creator.`);
            collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
            if (!collected.first()) return message.channel.send(":x: | Command timed out.");
            if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
            if (collected.first().content.length > 2048) return message.channel.send(":x: | Field value cannot exceed 2048 characters. Command cancelled.");
            embed.addField(fieldname, collected.first().content)
            embedMsg.edit("", {embed: embed})
            message.channel.send(`Field ${count} has been added to your embed. You can move onto next Field or \`skip\` to skip to Image.`).then(m => m.delete({timeout : 3000}))
            count++;
          }
        }
      }
      //Image
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit(":nine: - There won't be a Image for this embed. What would be the Footer Text for this embed? You can use up to 2048 characters. \n`skip` for nothing, `cancel` for cancelling the creator.");
      } else if (collected.first().attachments.first()) {
        msg.edit(`:nine: - Image has been set to the image you sent. What would be the Footer Text for this embed? You can use up to 2048 characters. \n\`skip\` for nothing, \`cancel\` for cancelling the creator.`);
        embed.setImage(collected.first().attachments.first().url)
        embedMsg.edit("", embed)
      } else {
        return message.channel.send(":x: | No image attached, command cancelled.");
      }
      //Footer
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "skip") {
        msg.edit(":keycap_ten: - There won't be a Footer for this embed. Should embed have a Timestamp? \n`yes` or `no`, `cancel` for cancelling the creator.")
      } else {
        if (collected.first().content.length > 2048) return message.channel.send(":x: | Footer text cannot exceed 2048 characters. Command cancelled.");
        msg.edit(`:nine: - :one: - Footer Text will be set to your message. What would be the Footer Icon for this embed? You need to upload a image or send a link can embed the image. \n\`skip\` for nothing , \`cancel\` for cancelling the creator.`);
        let footer = collected.first().content
        embed.setFooter(footer)
        embedMsg.edit("", embed)

        //Footer icon
        collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
        if (!collected.first()) return message.channel.send(":x: | Command timed out.");
        if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
        if (collected.first().content.toLowerCase() === "skip") {
          msg.edit(":keycap_ten: - There won't be a Footer Icon for this embed.  Should embed have a Timestamp?. \n`yes` or `no`, `cancel` for cancelling the creator.");
        } else if (collected.first().attachments.first()) {
          msg.edit(`:keycap_ten: - Footer image will be set to the image you sent. Should embed have a Timestamp? \n\`yes\` or \`no\`, \`cancel\` for cancelling the creator.`);
          embed.setFooter(footer, collected.first().attachments.first().url)
          embedMsg.edit("", embed)
        } else {
          return message.channel.send(":x: | No image attached, command cancelled.");
        }
      }
      //Timestamp
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      if (collected.first().content.toLowerCase() === "yes") {
        msg.edit(":ballot_box_with_check: - Timestamp will be set to the current timestamp. \n**All done!** Now you have to mention a **channel** for this embed to be sent. \n`cancel` for cancelling the creator.");
        embed.setTimestamp()
        embedMsg.edit("", embed)
      } else {
        msg.edit(":ballot_box_with_check: - There won't be a Timestamp for this embed. \n**All done!** Now you have to mention a **channel** for this embed to be sent. \n`cancel` for cancelling the creator.")
      }
      //Channel
      collected = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 120000 });
      if (!collected.first()) return message.channel.send(":x: | Command timed out.");
      if (collected.first().content.toLowerCase() === "cancel") return message.channel.send(":x: | Command cancelled.");
      let channel = collected.first().mentions.channels.first()
      if (!channel) return message.channel.send(":x: | You didn't mention a true channel. Command cancelled.");
      channel.send(embed).then(() => {
        msg.delete()
        embedMsg.delete()
        return message.channel.send(`:white_check_mark: | Embed has been successfully sent in ${channel}.`, embed)
      }).catch(err => {
        return message.channel.send("There was a error while sending the embed: " + err)
      })
  }
};

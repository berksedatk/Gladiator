const Discord = require("discord.js");
const w3color = require("../../w3color.js");
const Canvas = require("canvas");

module.exports = {
  name: "color",
  category: "Utility",
  description: "View a color to it's details.",
  aliases: ["cl"],
  examples: "g!color #628f1a\ng!color names\ng!color rgb(100, 155, 0)",
  usage: "<color[name(s), hex, rgb, hsl, hwb, cmyk, ncol] - color type>",
  cooldown: 5,
  async execute(bot, message, args) {
    if (!args[0]) return message.channel.send("<:cross:724049024943915209> | You didn't provide a color.\nA color can be name, hex, rgb, hsl, hwb, cmyk or a ncol. To get into details please use the command with the color type.")

    if (args[0].toLowerCase() === "name" || args[0].toLowerCase() === "names") {
      //Name
      let colors = ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen']
      return message.channel.send({embed: {description: `**Name of a color, here is the colors that are defined:** \n${colors.join(", ")}`}, color: "LIGHTBLUE"})
    } else if (args[0].toLowerCase() === "hex") {
      //Hex
      return message.channel.send({embed: {description: `Hexadecimal numerals are widely used by computer system designers and programmers, as they provide a human-friendly representation of binary-coded values. Each hexadecimal digit represents four binary digits, also known as a nibble, which is half a byte. For example, a single byte can have values ranging from 00000000 to 11111111 in binary form, which can be conveniently represented as 00 to FF in hexadecimal. Here are some examples:\n\n**#3f97b3 \nRed: 3f => 00111111\nGreen: 97 => 10010111\nBlue: b3 => 10110011\nBinary: 1111111001011110110011\nDecimal: 4167603**`}})
    } else if (args[0].toLowerCase() === "rgb") {
      //Rgb
      return message.channel.send({embed: {description: `The RGB color model is an additive color model in which red, green, and blue light are added together in various ways to reproduce a broad array of colors. The name of the model comes from the initials of the three additive primary colors, red, green, and blue. Here are some examples: \n\n**rgb(13, 56, 125)\n Red: 13 our of 255\nGreen: 56 out of 255\nBlue: 125 out of 255**`}})
    } else if (args[0].toLowerCase() === "hsl") {
      //Hsl
      return message.channel.send({embed: {description: `HSL (hue, saturation, lightness) is a alternative representation of the RGB color model, designed in the 1970s by computer graphics researchers to more closely align with the way human vision perceives color-making attributes. In these models, colors of each hue are arranged in a radial slice, around a central axis of neutral colors which ranges from black at the bottom to white at the top. Here are some examples: \n\n**hsl(194, 48%, 47%)\nHue: 194\nSaturation: 48%\nLightness: 47%**`}})
    } else if (args[0].toLowerCase() === "hwb") {
      //Hwb
      return message.channel.send({embed: {description: `HWB is a cylindrical-coordinate representation of points in an RGB color model, similar to HSL and HSV. It was developed by HSV’s creator Alvy Ray Smith in 1996 to address some of the issues with HSV. HWB was designed to be more intuitive for humans to use and slightly faster to compute. The first coordinate, H (Hue), is the same as the Hue coordinate in HSL and HSV. W and B stand for Whiteness and Blackness respectively and range from 0–100% (or 0–1). The mental model is that the user can pick a main hue and then “mix” it with white and/or black to produce the desired color. Here are some examples:\n\n**hwb(0, 22%, 48%)\nHue: 0\nWhiteness: 22%\nBlackness: 48%**`}})
    } else if (args[0].toLowerCase() === "cmyk") {
      //Cmyk
      return message.channel.send({embed: {description: `The CMYK color model (process color, four color) is a subtractive color model, based on the CMY color model, used in color printing, and is also used to describe the printing process itself. CMYK refers to the four ink plates used in some color printing: **c**yan, **m**agenta, **y**ellow, and **k**ey (black). Here are some examples: \n\n**cmyk(48%, 78%, 0%, 0%)\nCyan: 48%\nMagenta: 78%\nYellow: 0%\nKey(black): 0%**`}})
    } else if (args[0].toLowerCase() === "ncol") {
      //Ncol
      return message.channel.send({embed: {description: `Natural colors (NCol) is an initiative from W3Schools. The system is designed to make it easier to select HTML colors. NCol specifies colors using a color letter with a number to specify the distance (in percent) from the color. R30 means 30% away from Red , moving towards Yellow. (In other words: Red with 30% Yellow) Here are some examples: \n\n**R19, 14%, 5%\nNCol R19: \n-R => Red\n-19 => 19% to Yellow\nWhiteness: 14%\nBlackness: 5%**`}})
    } else {
      let color = args.join(" ")
      if (!w3color(color).valid) return message.channel.send("<:cross:724049024943915209> | You didn't provide a true color.\n A color can be name, hex, rgb, hsl, hwb, cmyk or a ncol. To get into details please use the command with the color type.")

      let name = w3color(color).toName()
      let rgb = w3color(color).toRgbString()
      let hex = w3color(color).toHexString()
      let hsl = w3color(color).toHslString()
      let hwb = w3color(color).toHwbString()
      let cmyk = w3color(color).toCmykString()
      let ncol = w3color(color).toNcolString()

      const canvas = Canvas.createCanvas(250, 250);
      const ctx = canvas.getContext("2d");

      ctx.beginPath();
      ctx.rect(0, 0, 250, 250);
      ctx.fillStyle = hex
      ctx.fill();

      let attachment = new Discord.MessageAttachment(canvas.toBuffer(), "color.png");

      await bot.channels.cache.get("729422471744323684").send(attachment).then(msg => {
        attachment = msg.attachments.first()
      })

      let colorembed = new Discord.MessageEmbed()
      .setTitle(color)
      .setColor(w3color(color).toHexString())
      .setThumbnail(attachment.url)
      if (name) colorembed.addField("Name", name)
      colorembed.addField("RGB", rgb, true)
      .addField("Hex", hex, true)
      .addField("Hsl", hsl)
      .addField("Hwb", hwb)
      .addField("Cmyk", cmyk)
      .addField("Ncol", ncol)
      .setFooter(`You can get into details of a color type by refeing while using the command.`)
      message.channel.send(colorembed)
    }
  }
};

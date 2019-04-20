const { MessageEmbed } = require('discord.js');
const {
  COLORS: { DEFAULTS },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT: EVEN_VALUE }
} = require('./Constants.js');
const Random = require('./Random.js');

class MessageUtil {
  static createFieldsMessage(channel, fieldsAndValues, inline = true, color = null) {
    const embed = new MessageEmbed()
      .setColor(color ? color : Random.arrayElement(DEFAULTS));

    for (let i = 0; i < fieldsAndValues.length - 1; i++) {
      if (!(i % EVEN_VALUE)) {
        embed.addField(fieldsAndValues[i], fieldsAndValues[i + 1], inline);
      }
    }

    return channel.send({ embed });
  }

  static createMessage(channel, description, options = {}) {
    const embed = new MessageEmbed()
      .setColor(options.color ? options.color : Random.arrayElement(DEFAULTS))
      .setDescription(description);

    if (options.title) {
      embed.setTitle(options.title);
    }

    if (options.author) {
      embed.setAuthor(options.author.name, options.author.icon, options.author.URL);
    }

    if (options.footer) {
      embed.setFooter(options.footer.text, options.footer.icon);
    }

    if (options.timestamp) {
      embed.setTimestamp();
    }

    return channel.send({ embed });
  }

  static async notify(member, message, type) {
    const dbUser = await member.dbUser();

    if (dbUser.notifications.includes(type.toLowerCase())) {
      return;
    }

    return member.tryDM(message, { guild: member.guild });
  }
}

module.exports = MessageUtil;

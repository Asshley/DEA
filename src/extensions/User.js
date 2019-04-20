const { Structures } = require('discord.js');
const {
  COLORS: { ERROR: ERROR_COLOR }
} = require('../utility/Constants.js');
const MessageUtil = require('../utility/MessageUtil.js');

Structures.extend('User', U => {
  class User extends U {
    DM(description, options = {}) {
      if (options.guild) {
        options.footer = {
          text: options.guild.name, icon: options.guild.iconURL()
        };
      }

      return MessageUtil.createMessage(this, description, options);
    }

    async tryDM(description, options = {}) {
      try {
        await this.DM(description, options);

        return true;
      } catch (err) {
        return false;
      }
    }

    DMFields(fieldsAndValues, inline = true, color = null) {
      return MessageUtil.createFieldsMessage(this, fieldsAndValues, inline, color);
    }

    DMError(description, options = {}) {
      options.color = ERROR_COLOR;

      return this.DM(description, options);
    }
  }

  return User;
});

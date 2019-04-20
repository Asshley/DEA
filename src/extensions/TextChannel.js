const { Structures } = require('discord.js');
const {
  COLORS: { ERROR: ERROR_COLOR }
} = require('../utility/Constants.js');
const MessageUtil = require('../utility/MessageUtil.js');

Structures.extend('TextChannel', T => {
  class TextChannel extends T {
    createMessage(description, options = {}) {
      return MessageUtil.createMessage(this, description, options);
    }

    createErrorMessage(description, options = {}) {
      options.color = ERROR_COLOR;

      return this.createMessage(description, options);
    }

    createFieldsMessage(fieldsAndValues, inline = true, color = null) {
      return MessageUtil.createFieldsMessage(this, fieldsAndValues, inline, color);
    }

    async tryCreateMessage(description, options = {}) {
      const permissions = this.permissionsFor(this.guild.me);

      if (permissions.has('SEND_MESSAGES') && permissions.has('EMBED_LINKS')) {
        await this.createMessage(description, options);

        return true;
      }

      return false;
    }

    tryCreateErrorMessage(description, options = {}) {
      options.color = ERROR_COLOR;

      return this.tryCreateMessage(description, options);
    }
  }

  return TextChannel;
});

const { Structures } = require('discord.js');
const {
  COLORS: { ERROR_COLOR }
} = require('../utility/Constants.js');
const MessageUtil = require('../utility/MessageUtil.js');

Structures.extend('DMChannel', DMC => {
  class DMChannel extends DMC {
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
      try {
        await this.createMessage(description, options);

        return true;
      } catch (_) {
        return false;
      }
    }

    tryCreateErrorMessage(description, options = {}) {
      options.color = ERROR_COLOR;

      return this.tryCreateMessage(description, options);
    }
  }

  return DMChannel;
});

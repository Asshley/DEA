const Eris = require('eris');
const { colors } = require('../../data/config.json');
const MessageUtil = require('../utility/MessageUtil.js');

class TextBasedChannel {
  static applyExtensions(structure) {
    structure.prototype.sendMessage = function(description, options = {}) {
      return MessageUtil.sendMessage(this, description, options);
    };
    structure.prototype.createErrorMessage = function(description, options = {}) {
      options.color = colors.error;

      return this.sendMessage(description, options);
    };
    structure.prototype.sendFieldsMessage = function(fields, inline = true, color = null) {
      return MessageUtil.sendFieldsMessage(this, fields, inline, color);
    };
    structure.prototype.trySendMessage = async function(description, options = {}) {
      if (structure === Eris.TextChannel) {
        const perms = this.permissionsOf(this.guild.shard.client.user.id);

        if (perms.has('sendMessages') && perms.has('embedLinks')) {
          await this.sendMessage(description, options);

          return true;
        }

        return false;
      }

      try {
        await this.sendMessage(description, options);

        return true;
      } catch (_) {
        return false;
      }
    };
    structure.prototype.tryCreateErrorMessage = function(description, options = {}) {
      options.color = colors.error;

      return this.trySendMessage(description, options);
    };
  }
}
TextBasedChannel.applyExtensions(Eris.PrivateChannel);
TextBasedChannel.applyExtensions(Eris.TextChannel);

const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Event = require('../structures/Event.js');
const handler = require('../services/handler.js');

class MessageUpdate extends Event {
  async run(newMessage, oldMessage) {
    if (!oldMessage || oldMessage.content === newMessage.content) {
      return;
    }

    const command = await handler.parseCommand(oldMessage, newMessage._client.config.prefix.length);

    if (!command.success && !newMessage.editedCommand) {
      newMessage.editedCommand = true;
      this.emitter.emit('messageCreate', newMessage);
    }
  }
}
MessageUpdate.EVENT_NAME = CLIENT_EVENTS.MESSAGE_UPDATE;

module.exports = MessageUpdate;

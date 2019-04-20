const Event = require('../structures/Event.js');
const { PREFIX } = require('../utility/Constants.js');
const handler = require('../singletons/handler.js');

class MessageUpdateEvent extends Event {
  async run(oldMessage, newMessage) {
    const command = await handler.parseCommand(oldMessage, PREFIX.length);

    if (!command.success) {
      this.emitter.emit('message', newMessage);
    }
  }
}
MessageUpdateEvent.eventName = 'messageUpdate';

module.exports = MessageUpdateEvent;

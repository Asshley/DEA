const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class DisconnectEvent extends Event {
  run() {
    Logger.log(`${this.emitter.user.username} has disconnected.`, 'WARNING');
  }
}
DisconnectEvent.eventName = 'disconnect';

module.exports = DisconnectEvent;

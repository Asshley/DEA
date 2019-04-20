const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class ReconnectEvent extends Event {
  run() {
    Logger.log('Attempting to reconnect...', 'INFO');
  }
}
ReconnectEvent.eventName = 'reconnect';

module.exports = ReconnectEvent;

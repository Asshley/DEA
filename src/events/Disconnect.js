const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class DisconnectEvent extends Event {
  run() {
    Logger.log(`${this.client.user.username} has disconnected.`, 'WARNING');
  }
}

module.exports = DisconnectEvent;

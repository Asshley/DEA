const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class Disconnect extends Event {
  run() {
    Logger.log(`${this.emitter.user.username} has disconnected.`, 'WARNING');
  }
}
Disconnect.EVENT_NAME = CLIENT_EVENTS.DISCONNECT;

module.exports = Disconnect;

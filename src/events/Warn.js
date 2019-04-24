const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Event = require('../structures/Event.js');
const Logger = require('../utility/Logger.js');

class Warn extends Event {
  run(warning) {
    Logger.log(warning, 'WARNING');
  }
}
Warn.EVENT_NAME = CLIENT_EVENTS.WARN;

module.exports = Warn;

const Event = require('../structures/Event.js');
const Logger = require('../utility/Logger.js');

class WarnEvent extends Event {
  run(warning) {
    Logger.log(warning, 'WARNING');
  }
}
WarnEvent.EVENT_NAME = 'warn';

module.exports = WarnEvent;

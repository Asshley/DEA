const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class ErrorEvent extends Event {
  run(err) {
    Logger.handleError(err);
  }
}

module.exports = ErrorEvent;

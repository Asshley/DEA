const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class ErrorEvent extends Event {
  run(err) {
    Logger.handleError(err);
  }
}
ErrorEvent.eventName = 'channelDelete';

module.exports = ErrorEvent;

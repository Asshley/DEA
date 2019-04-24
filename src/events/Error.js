const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');
const { CLIENT_EVENTS } = require('../utility/Constants.js');

class _Error extends Event {
  run(err) {
    Logger.handleError(err);
  }
}
_Error.EVENT_NAME = CLIENT_EVENTS.ERROR;

module.exports = _Error;

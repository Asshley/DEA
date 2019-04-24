const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class ShardDisconnect extends Event {
  run(err, id) {
    Logger.log(`Shard #${id} disconnected${err ? ` ${err.stack}` : '.'}`, 'INFO');
  }
}
ShardDisconnect.EVENT_NAME = CLIENT_EVENTS.SHARD_DISCONNECT;

module.exports = ShardDisconnect;

const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');
const { CLIENT_EVENTS } = require('../utility/Constants.js');

class ShardReady extends Event {
  run(id) {
    Logger.log(`Shard #${id} is ready.`, 'INFO');
  }
}
ShardReady.EVENT_NAME = CLIENT_EVENTS.SHARD_READY;

module.exports = ShardReady;

const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class ShardResume extends Event {
  run(id) {
    Logger.log(`Shard #${id} resumed.`, 'INFO');
  }
}
ShardResume.EVENT_NAME = CLIENT_EVENTS.SHARD_RESUME;

module.exports = ShardResume;

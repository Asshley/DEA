const { CLIENT_EVENTS } = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');
const StringUtil = require('../utility/StringUtil.js');

class Ready extends Event {
  run() {
    Logger.log(`${this.emitter.user.username}#${this.emitter.user.discriminator} \
has successfully connected.`, 'INFO');

    return this.emitter.editStatus({
      name: StringUtil.format(this.emitter.config.activity, this.emitter.config.prefix)
    });
  }
}
Ready.EVENT_NAME = CLIENT_EVENTS.READY;

module.exports = Ready;

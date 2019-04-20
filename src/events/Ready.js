const { ACTIVITY } = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');
const PRESENCE_CLEAR_INTERVAL = 1e3;

class ReadyEvent extends Event {
  run() {
    this.emitter.setInterval(() => {
      for (const guild of this.emitter.guilds.values()) {
        guild.presences.clear();
      }
    }, PRESENCE_CLEAR_INTERVAL);
    Logger.log(`${this.emitter.user.tag} has successfully connected.`, 'INFO');

    return this.emitter.user.setActivity(ACTIVITY);
  }
}
ReadyEvent.eventName = 'ready';

module.exports = ReadyEvent;

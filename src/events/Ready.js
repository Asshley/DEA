const { ACTIVITY } = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');
const PRESENCE_CLEAR_INTERVAL = 1e3;

class ReadyEvent extends Event {
  run() {
    this.client.setInterval(() => {
      for (const guild of this.client.guilds.values()) {
        guild.presences.clear();
      }
    }, PRESENCE_CLEAR_INTERVAL);
    Logger.log(`${this.client.user.tag} has successfully connected.`, 'INFO');

    return this.client.user.setActivity(ACTIVITY);
  }
}

module.exports = ReadyEvent;

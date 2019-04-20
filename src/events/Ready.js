const { ACTIVITY } = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');

class ReadyEvent extends Event {
  run() {
    Logger.log(`${this.client.user.tag} has successfully connected.`, 'INFO');

    this.client.setInterval(() => {
      for (const guild of this.client.guilds.values()) {
        guild.presences.clear();
      }
    }, 1e3);

    return this.client.user.setActivity(ACTIVITY);
  }
}

module.exports = ReadyEvent;

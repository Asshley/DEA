const { Group } = require('patron.js');

class BotOwners extends Group {
  constructor() {
    super({
      name: 'botowners',
      description: 'These commands may only be used by the owners of DEA.',
      preconditions: ['botowner']
    });
  }
}

module.exports = new BotOwners();

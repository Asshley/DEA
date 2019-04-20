const { Group } = require('patron.js');

class System extends Group {
  constructor() {
    super({
      name: 'system',
      description: 'These commands are the normal bot commands.'
    });
  }
}

module.exports = new System();

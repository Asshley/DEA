const { Group } = require('patron.js');

class Gambling extends Group {
  constructor() {
    super({
      name: 'gambling',
      description: 'Gambling is fun kids.'
    });
  }
}

module.exports = new Gambling();

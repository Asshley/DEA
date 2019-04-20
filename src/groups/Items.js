const { Group } = require('patron.js');

class Items extends Group {
  constructor() {
    super({
      name: 'items',
      description: 'These commands are for items.'
    });
  }
}

module.exports = new Items();

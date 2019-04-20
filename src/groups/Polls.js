const { Group } = require('patron.js');

class Polls extends Group {
  constructor() {
    super({
      name: 'polls',
      description: 'These commands are for polls.'
    });
  }
}

module.exports = new Polls();

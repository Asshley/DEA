const { Group } = require('patron.js');

class General extends Group {
  constructor() {
    super({
      name: 'general',
      description: 'These commands aren\'t used with money.'
    });
  }
}

module.exports = new General();

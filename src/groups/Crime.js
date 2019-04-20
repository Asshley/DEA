const { Group } = require('patron.js');

class Crime extends Group {
  constructor() {
    super({
      name: 'crime',
      description: 'These commands are for crime.'
    });
  }
}

module.exports = new Crime();

const { Group } = require('patron.js');

class Gangs extends Group {
  constructor() {
    super({
      name: 'gangs',
      description: 'These commands are for gangs.'
    });
  }
}

module.exports = new Gangs();

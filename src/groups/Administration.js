const { Group } = require('patron.js');

class Administration extends Group {
  constructor() {
    super({
      name: 'administration',
      description: 'These commands may only be used by a user with the set mod role with a \
permission level of 2 or the Administrator permission.',
      preconditions: ['administrator']
    });
  }
}

module.exports = new Administration();

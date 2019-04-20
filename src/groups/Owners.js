const { Group } = require('patron.js');

class Owners extends Group {
  constructor() {
    super({
      name: 'owners',
      description: 'These commands may only be used by a user with the set mod role with a \
permission level of 3 or the ownership of the server.',
      preconditions: ['owner']
    });
  }
}

module.exports = new Owners();

const { Group } = require('patron.js');

class Moderation extends Group {
  constructor() {
    super({
      name: 'moderation',
      description: 'These commands may only be used by a user with the set mod role with a \
permission level of 1 or the Administrator permission.',
      preconditions: ['moderator']
    });
  }
}

module.exports = new Moderation();

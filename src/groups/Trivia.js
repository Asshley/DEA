const { Group } = require('patron.js');

class Trivia extends Group {
  constructor() {
    super({
      name: 'trivia',
      description: 'These commands are related to trivia.'
    });
  }
}

module.exports = new Trivia();

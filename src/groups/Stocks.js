const { Group } = require('patron.js');

class Stocks extends Group {
  constructor() {
    super({
      name: 'stocks',
      description: 'These commands are used with the stock market.'
    });
  }
}

module.exports = new Stocks();

const { Client: ErisClient } = require('eris');

class Client extends ErisClient {
  constructor(options) {
    super(options.token, options.erisOptions);
    Object.defineProperty(this, 'registry', { value: options.registry });
    Object.defineProperty(this, 'db', { value: options.db });
  }
}

module.exports = Client;

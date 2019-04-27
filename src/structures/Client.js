const { Client: ErisClient } = require('eris');

class Client extends ErisClient {
  constructor(options) {
    super(options.token, options.erisOptions);
    this.config = options.config;
    Object.defineProperty(this, 'registry', { value: options.registry });
    Object.defineProperty(this, 'db', { value: options.db });
  }
}

module.exports = Client;

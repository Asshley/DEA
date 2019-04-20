const { Client: _Client } = require('discord.js');
const { CLIENT_OPTIONS } = require('../utility/Constants.js');
const Database = require('../database/Database.js');
const registry = require('../singletons/registry.js');

class Client extends _Client {
  constructor(reg, db, options) {
    super(options);
    Object.defineProperty(this, 'registry', { value: reg });
    Object.defineProperty(this, 'db', { value: db });
  }
}

module.exports = new Client(registry, new Database(), CLIENT_OPTIONS);

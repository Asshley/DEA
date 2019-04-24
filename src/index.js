const Patron = require('patron.js');
const Client = require('./structures/Client.js');
const Constants = require('./utility/Constants.js');
const Database = require('./database/Database.js');
const IntervalService = require('./services/IntervalService.js');
const EventService = require('./services/EventService.js');
const path = require('path');
const registry = require('./services/registry.js');

class Main {
  static async init() {
    require('dotenv').config();
    await Patron.RequireAll(path.join(__dirname, 'extensions'));

    const db = new Database();
    const client = new Client({
      token: process.env.BOT_TOKEN,
      erisOptions: Constants.CLIENT_OPTIONS,
      db,
      registry
    });

    await client.db.connect(process.env.MONGO_DB_URL);
    await EventService.initiate(client);
    await IntervalService.initiate(client);

    return client.connect();
  }
}
Main.init();

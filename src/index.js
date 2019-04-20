const patron = require('patron.js');
const path = require('path');
const IntervalService = require('./services/IntervalService.js');
const EventService = require('./services/EventService.js');

class Main {
  static async init() {
    require('dotenv').config();
    await patron.RequireAll(path.join(__dirname, 'extensions'));

    const client = require('./structures/Client.js');

    await client.db.connect(process.env.MONGO_DB_URL);
    await EventService.initiate(client);
    await IntervalService.initiate(client);

    return client.login(process.env.BOT_TOKEN);
  }
}
Main.init();

const path = require('path');
const patron = require('patron.js');

class EventService {
  static async initiate(client) {
    const Events = await patron.RequireAll(path.join(__dirname, '../events'));

    for (let i = 0; i < Events.length; i++) {
      new Events[i](client).listen();
    }
  }
}

module.exports = EventService;

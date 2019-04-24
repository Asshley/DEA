const Patron = require('patron.js');
const path = require('path');

class IntervalService {
  static async initiate(client) {
    const Intervals = await Patron.RequireAll(path.join(__dirname, '../intervals'));

    for (let i = 0; i < Intervals.length; i++) {
      new Intervals[i](client).tick();
    }
  }
}

module.exports = IntervalService;

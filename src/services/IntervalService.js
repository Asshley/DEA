const path = require('path');
const patron = require('patron.js');

class IntervalService {
  static async initiate(client) {
    const Intervals = await patron.RequireAll(path.join(__dirname, '../intervals'));

    for (let i = 0; i < Intervals.length; i++) {
      new Intervals[i](client).tick();
    }
  }
}

module.exports = IntervalService;

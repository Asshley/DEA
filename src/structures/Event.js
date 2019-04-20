const Util = require('../utility/Util.js');
const SLICE_AMOUNT = 5;

class Event {
  constructor(client) {
    this.client = client;
    this.listener = this.run.bind(this);
  }

  get eventName() {
    const camelCase = Util.toCamelCase(this.constructor.name);

    return camelCase.slice(0, camelCase.length - SLICE_AMOUNT);
  }

  async run() {
    throw new Error(`The ${this.eventName} listener has not implemented a run method.`);
  }
}

module.exports = Event;

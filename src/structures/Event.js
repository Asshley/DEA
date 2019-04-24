class Event {
  constructor(emitter) {
    this.emitter = emitter;
    this.eventName = this.constructor.EVENT_NAME;
    this.listener = this.run.bind(this);
  }

  async run() {
    throw new Error(`The ${this.eventName} listener has not implemented a run method.`);
  }

  async listen() {
    this.emitter.on(this.eventName, this.listener);
  }
}

module.exports = Event;

class Interval {
  constructor(client, time) {
    this.client = client;
    this.time = time;
    this.cb = this.onTick.bind(this);
  }

  async onTick() {
    throw new Error(`The ${this.constructor.name} has not implemented an onTick method.`);
  }

  tick() {
    this.client.setInterval(this.cb, this.time);
  }
}

module.exports = Interval;

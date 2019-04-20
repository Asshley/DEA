class Ratelimit {
  constructor() {
    this.messageCount = 1;
    this.time = Date.now();
  }

  update() {
    this.messageCount++;
  }
}

module.exports = Ratelimit;

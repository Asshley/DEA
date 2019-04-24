const EventEmitter = require('eventemitter3');

class MessageCollector extends EventEmitter {
  constructor(channel, options) {
    super();
    this.channel = channel;
    this.results = [];
    this.filter = options.filter;
    this.time = options.time;
    this.max = options.max;
    this._finished = false;
    this._timeout = this.time ? setTimeout(this.end.bind(this), this.time) : null;
    this.constructor._collectors.push(this);
  }

  end() {
    if (this._finished) {
      return;
    }

    this._finished = true;

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    this.emit('end', this.results);
  }

  collect(msg) {
    if (this.channel.id === msg.channel.id && this.filter(msg) && this.max > this.results.length) {
      this.results.push(msg);
    }

    if (this.max <= this.results.length) {
      this.end();
    }
  }

  static collect(msg) {
    for (let i = 0; i < this._collectors.length; i++) {
      const collector = this._collectors[i];

      if (collector._finished) {
        this._collectors.splice(i, 1);
        i--;
        continue;
      }

      collector.collect(msg);
    }
  }
}
MessageCollector._collectors = [];

module.exports = {
  MessageCollector,
  awaitMessages: (c, o) => new Promise(r => new MessageCollector(c, o).once('end', r))
};

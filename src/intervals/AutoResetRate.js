const Interval = require('../structures/Interval.js');
const chatService = require('../services/ChatService.js');
const cooldowns = require('../../data/cooldowns.json');

class AutoRegenerateHealth extends Interval {
  constructor(client) {
    super(client, cooldowns.intervals.autoResetRate);
  }

  async onTick() {
    const diff = cooldowns.miscellanea.rateReset - (Date.now() - chatService.lastReset);

    if (diff > 0) {
      return;
    }

    const keys = Object.keys(chatService.messages);

    for (let i = 0; i < keys.length; i++) {
      chatService.messages[keys[i]].cpm = this.client.config.baseCPM;
    }

    chatService.lastReset = Date.now();
  }
}

module.exports = AutoRegenerateHealth;

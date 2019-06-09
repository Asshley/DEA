const Interval = require('../structures/Interval.js');
const cooldowns = require('../../data/cooldowns.json');

class AutoUnblacklist extends Interval {
  constructor(client) {
    super(client, cooldowns.intervals.autoUnblacklist);
  }

  async onTick() {
    const blacklists = await this.client.db.blacklistRepo.findMany();

    for (let i = 0; i < blacklists.length; i++) {
      const blacklist = blacklists[i];

      if (blacklist.time > Date.now()) {
        continue;
      }

      await this.client.db.blacklistRepo.deleteBlacklist(blacklist.userId);
    }
  }
}

module.exports = AutoUnblacklist;

const {
  MAX_AMOUNTS: { GANG: { PER_GUILD: MAX_GANGS } }
} = require('./Constants.js');

class GangUtil {
  constructor(data) {
    this.index = data.index;
    this.leaderId = data.leaderId;
    this.name = data.name;
    this.wealth = data.wealth || 0;
    this.vault = {};
    this.members = [];
  }

  static find(dbGuild, input) {
    const lowerInput = input.toLowerCase();

    return dbGuild.gangs
      .find(x => x.name.toLowerCase() === lowerInput || x.index === Number(input));
  }

  static getEmptyIndex(dbGuild) {
    const gangIndices = dbGuild.gangs.map(x => x.index);

    return Math.min(...GangUtil.INDICES.filter(x => !gangIndices.includes(x)));
  }

  static from(data) {
    return new this(data);
  }
}
GangUtil.INDICES = Array.from({ length: MAX_GANGS }, (_, i) => i + 1);

module.exports = GangUtil;

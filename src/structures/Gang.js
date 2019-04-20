const {
  MAX_AMOUNTS: { GANG: { PER_GUILD: MAX_GANGS } }
} = require('../utility/Constants.js');

class Gang {
  constructor(data) {
    this.data = data;
  }

  static findGang(dbGuild, input) {
    return dbGuild.gangs
      .find(x => x.name.toLowerCase() === input.toLowerCase() || x.index === Number(input));
  }

  static getEmptyIndex(dbGuild) {
    const gangIndices = dbGuild.gangs.map(x => x.index);

    return Math.min(...Gang.INDICES.filter(x => !gangIndices.includes(x)));
  }
}
Gang.INDICES = Array.from({ length: MAX_GANGS }, (_, i) => i + 1);

module.exports = Gang;

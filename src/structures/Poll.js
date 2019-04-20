const {
  MAX_AMOUNTS: { POLLS: { PER_GUILD: MAX_POLLS } }
} = require('../utility/Constants.js');

class Poll {
  constructor(data) {
    this.data = data;
  }

  static findPoll(dbGuild, input) {
    return dbGuild.polls
      .find(x => x.name.toLowerCase() === input.toLowerCase() || x.index === Number(input));
  }

  static getEmptyIndex(dbGuild) {
    const pollIndices = dbGuild.polls.map(x => x.index);

    return Math.min(...Poll.INDICES.filter(x => !pollIndices.includes(x)));
  }
}
Poll.INDICES = Array.from({ length: MAX_POLLS }, (_, i) => i + 1);

module.exports = Poll;

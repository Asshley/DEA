const {
  MISCELLANEA: { TO_PERCENT_AMOUNT, DECIMAL_ROUND_AMOUNT: ROUND, POT_EXPIRES },
  RESTRICTIONS: { COMMANDS: { POT: { MINIMUM_MEMBERS } } },
  MAX_AMOUNTS: { POT_ODDS }
} = require('../utility/Constants.js');
const NumberUtil = require('../utility/NumberUtil.js');
const Random = require('../utility/Random.js');

class Pot {
  constructor(owner, channel) {
    this.members = [];
    this.owner = owner;
    this.channel = channel;
    this.readyAt = null;
  }

  get expired() {
    return this.readyAt && Date.now() - this.readyAt >= POT_EXPIRES;
  }

  addMember(member, amount) {
    const obj = {
      id: member.id,
      deposited: amount
    };

    this.members.push(obj);

    if (this.members.length >= MINIMUM_MEMBERS && !this.readyAt) {
      this.readyAt = Date.now();
    }

    return obj;
  }

  addMoney(member, amount) {
    const index = this.members.findIndex(x => x.id === member.id);

    if (index !== -1) {
      this.members[index].deposited += amount;

      return this.members[index];
    }

    return this.addMember(member, amount);
  }

  draw() {
    let ranges = [0, 0];
    const odds = Random.nextFloat(0, POT_ODDS);
    const members = this.members.map(({ id }) => {
      const memberOdds = Pot.calculateOdds(this, id);
      const [, start] = ranges;
      const end = ranges[1] + memberOdds;

      ranges = [start, end];

      return {
        id,
        ranges,
        odds: memberOdds
      };
    });

    return members.find(x => odds > x.ranges[0] && odds <= x.ranges[1]);
  }

  static totalCash(pot) {
    return pot.members.reduce((a, b) => a + b.deposited, 0);
  }

  static calculateOdds(pot, id) {
    const total = this.totalCash(pot);

    return NumberUtil.round(pot.members
      .find(x => x.id === id).deposited / total * TO_PERCENT_AMOUNT, ROUND);
  }
}

module.exports = Pot;

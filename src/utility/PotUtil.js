const {
  MISCELLANEA: { TO_PERCENT_AMOUNT, DECIMAL_ROUND_AMOUNT: ROUND, POT_EXPIRES },
  RESTRICTIONS: { COMMANDS: { POT: { MINIMUM_MEMBERS } } },
  MAX_AMOUNTS: { POT_ODDS }
} = require('./Constants.js');
const NumberUtil = require('./NumberUtil.js');
const Random = require('./Random.js');

class PotUtil {
  constructor(data) {
    this.owner = data.owner;
    this.channel = data.channel;
    this.members = data.members || [];
    this.readyAt = data.readyAt || null;
  }

  get expired() {
    return this.readyAt && Date.now() - this.readyAt >= POT_EXPIRES;
  }

  get value() {
    return this.members.reduce((a, b) => a + b.deposited, 0);
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
    const ranges = [0, 0];
    const roll = Random.nextFloat(0, POT_ODDS);

    for (let i = 0; i < this.members.length; i++) {
      const odds = this.constructor.getOdds(this, this.members[i].id);

      [ranges[0], ranges[1]] = [ranges[1], ranges[0]];
      ranges[1] = ranges[0] + odds;

      if (roll > ranges[0] && roll <= ranges[1]) {
        return {
          id: this.members[i].id,
          odds
        };
      }
    }

    return null;
  }

  static getOdds(pot, id) {
    const { value } = pot;

    return NumberUtil.round(pot.members
      .find(x => x.id === id).deposited / value * TO_PERCENT_AMOUNT, ROUND);
  }

  static from(data) {
    return new this(data);
  }
}

module.exports = PotUtil;

const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const {
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT },
  RESTRICTIONS: { COMMANDS: { WITHDRAW } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class WithdrawPrec extends ArgumentPrecondition {
  constructor() {
    super({ name: 'withdrawprec' });
  }

  async run(command, msg, argument, args, value) {
    const gang = msg.dbGang;
    const max = this.calculateWithdraw(gang, msg);
    const maxVal = NumberUtil.round(NumberUtil.value(gang.wealth) * max, DECIMAL_ROUND_AMOUNT);

    if (value <= maxVal) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(
      command,
      `you may only withdraw ${max.toLocaleString('en', { style: 'percent' })} of your gang's \
wealth, that is ${NumberUtil.toUSD(maxVal)}.`
    );
  }

  calculateWithdraw(gang, msg) {
    if (gang.leaderId === msg.author.id) {
      return WITHDRAW.MAX.LEADER;
    } else if (gang.members.some(x => x.status === 'elder' && x.id === msg.author.id)) {
      return WITHDRAW.MAX.ELDER;
    }

    return WITHDRAW.MAX.MEMBER;
  }
}

module.exports = new WithdrawPrec();

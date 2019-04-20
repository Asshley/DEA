const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const { INVESTMENTS } = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Investment extends ArgumentPrecondition {
  constructor() {
    super({ name: 'investment' });
  }

  async run(command, msg, argument, args, value) {
    if (StringUtil.isNullOrWhiteSpace(value)) {
      return PreconditionResult.fromSuccess();
    }

    const validInvestments = Object.keys(INVESTMENTS);
    const investment = validInvestments.find(x => x.toLowerCase() === value.toLowerCase());

    if (!investment) {
      return PreconditionResult.fromError(command, 'you have provided an invalid investment.');
    }

    const lastIndex = validInvestments.indexOf(investment) - 1;
    const { dbUser } = msg;

    if (lastIndex >= 0 && !dbUser.investments.includes(validInvestments[lastIndex].toLowerCase())) {
      return PreconditionResult.fromError(command, `you need to buy \
${StringUtil.upperFirstChar(validInvestments[lastIndex].toLowerCase())} first.`);
    }

    if (dbUser.investments.includes(investment.toLowerCase())) {
      return PreconditionResult.fromError(command, `you already have \
${StringUtil.upperFirstChar(investment.toLowerCase())}.`);
    }

    const investmentObject = INVESTMENTS[investment];

    if (investment === 'snowcap' && dbUser.revivable && dbUser.revivable - Date.now() > 0) {
      return PreconditionResult.fromError(command, `you need to wait \
${NumberUtil.msToTime(investmentObject.TIME).days} days before purchasing this investment again.`);
    }

    const cashValue = NumberUtil.value(dbUser.cash);

    if (investmentObject.COST > cashValue) {
      return PreconditionResult.fromError(command, `you need ${NumberUtil
        .toUSD(investmentObject.COST)} to buy ${StringUtil
        .upperFirstChar(investment.toLowerCase())}. Balance: ${NumberUtil.toUSD(cashValue)}.`);
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new Investment();

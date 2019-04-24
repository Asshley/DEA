const { ArgumentPrecondition, PreconditionResult } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Cash extends ArgumentPrecondition {
  constructor() {
    super({ name: 'cash' });
  }

  async run(command, msg, argument, args, value) {
    const realValue = NumberUtil.value(msg.dbUser.cash);
    let val = value;

    if (command.names[0] === 'rob' && argument.typeReader.inputtedAll) {
      val = args[`${argument.name}-all`];
    }

    if (val === 'null' || realValue >= val) {
      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, `you do not have ${NumberUtil.toUSD(val)}. \
Balance: ${NumberUtil.toUSD(realValue)}.`);
  }
}

module.exports = new Cash();

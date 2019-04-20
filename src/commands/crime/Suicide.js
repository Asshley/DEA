const { Command } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { SUICIDE } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Suicide extends Command {
  constructor() {
    super({
      names: ['suicide', 'kms'],
      groupName: 'crime',
      description: 'Kill yourself.'
    });
  }

  async run(msg) {
    if (NumberUtil.value(msg.dbUser.cash) < SUICIDE.CASH_REQUIRED) {
      return msg.createErrorReply(
        `You need ${NumberUtil.toUSD(SUICIDE.CASH_REQUIRED)} to buy yourself a good noose.`
      );
    }

    const update = {
      $set: {
        inventory: {},
        investments: [],
        health: 100,
        cash: 0
      }
    };

    await msg.client.db.userRepo.updateUser(msg.member.id, msg.guild.id, update);

    return msg.createReply('you\'ve successfully killed yourself.');
  }
}

module.exports = new Suicide();

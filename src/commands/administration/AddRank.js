const { Command, Argument } = require('patron.js');
const {
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class AddRank extends Command {
  constructor() {
    super({
      names: ['addrank', 'setrank', 'enablerank'],
      groupName: 'administration',
      description: 'Add a rank.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Sicario',
          preconditions: ['hierarchy']
        }),
        new Argument({
          name: 'cashRequired',
          key: 'cashRequired',
          type: 'amount',
          example: '500'
        })
      ]
    });
  }

  async run(msg, args) {
    const ranks = msg.dbGuild.roles.rank;

    if (ranks.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('this rank role has already been set.');
    }

    const update = {
      $push: {
        'roles.rank': {
          id: args.role.id,
          cashRequired: NumberUtil.round(args.cashRequired, DECIMAL_ROUND_AMOUNT)
        }
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully added the rank role ${args.role} with a cash \
required amount of ${NumberUtil.toUSD(args.cashRequired)}.`);
  }
}

module.exports = new AddRank();

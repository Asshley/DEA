const { Command, Argument } = require('patron.js');
const {
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.addRank.existing);
    }

    const update = {
      $push: {
        'roles.rank': {
          id: args.role.id,
          cashRequired: NumberUtil.round(args.cashRequired, DECIMAL_ROUND_AMOUNT)
        }
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.addRank.successful, args.role.mention, NumberUtil.toUSD(args.cashRequired)
    ));
  }
}

module.exports = new AddRank();

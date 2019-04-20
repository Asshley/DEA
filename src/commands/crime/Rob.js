const { Command, Argument } = require('patron.js');
const {
  MESSAGES: { ROB: ROB_MESSAGES },
  COOLDOWNS: { ROB: ROB_COOLDOWN },
  ODDS: { ROB: ROB_ODDS },
  RESTRICTIONS: { COMMANDS: { ROB: { MINIMUM_CASH, MAXIMUM_CASH } } }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class Rob extends Command {
  constructor() {
    super({
      names: ['rob'],
      groupName: 'crime',
      description: 'Use your cash to rob a user.',
      postconditions: ['reducedcooldown'],
      cooldown: ROB_COOLDOWN,
      args: [
        new Argument({
          name: 'member',
          type: 'member',
          key: 'member',
          example: 'ThiccJoe#7777',
          preconditions: ['noself']
        }),
        new Argument({
          name: 'resources',
          type: 'cash',
          key: 'resources',
          example: '500',
          preconditionOptions: [{ percent: MAXIMUM_CASH }, { minimum: MINIMUM_CASH }],
          preconditions: ['cashpercent', 'minimumcash', 'cash']
        })
      ]
    });
  }

  async run(msg, args) {
    const reader = msg.client.registry.typeReaders.find(x => x.type === 'cash');

    if (reader.inputtedAll) {
      args.resources = args['resources-all'];
    }

    const roll = Random.roll();

    if (roll < ROB_ODDS) {
      await msg.client.db.userRepo.modifyCash(msg.dbGuild, args.member, -args.resources);
      await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, args.resources);

      return msg.createReply(StringUtil.format(ROB_MESSAGES.OK, NumberUtil.toUSD(args.resources)));
    }

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.resources);

    return msg.createReply(ROB_MESSAGES.FAIL);
  }
}

module.exports = new Rob();

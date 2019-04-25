const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { BOUNTY: { MINIMUM: MINIMUM_BOUNTY } } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class AddBounty extends Command {
  constructor() {
    super({
      names: ['addbounty'],
      groupName: 'general',
      description: 'Add a bounty on a user.',
      args: [
        new Argument({
          name: 'bounty',
          key: 'bounty',
          type: 'cash',
          preconditionOptions: [{ minimum: MINIMUM_BOUNTY }],
          preconditions: ['minimumcash', 'cash'],
          example: '500'
        }),
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'swagdaddy#4200',
          preconditions: ['noself']
        })
      ]
    });
  }

  async run(msg, args) {
    await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.bounty);

    const res = await msg._client.db.userRepo.modifyBounty(msg.dbGuild, args.member, args.bounty);

    return msg.createReply(StringUtil.format(
      messages.commands.addBounty,
      NumberUtil.toUSD(args.bounty),
      `${args.member.user.username}#${args.member.user.discriminator}`,
      NumberUtil.format(res.bounty)
    ));
  }
}

module.exports = new AddBounty();

const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { BOUNTY: { MINIMUM: MINIMUM_BOUNTY } } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');

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
    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.bounty);

    const newDbUser = await msg.client.db.userRepo
      .modifyBounty(msg.dbGuild, args.member, args.bounty);

    return msg.createReply(`you've successfully added a bounty of ${NumberUtil.toUSD(args.bounty)} \
to ${args.member.user.tag}, making his total bounty ${NumberUtil.format(newDbUser.bounty)}.`);
  }
}

module.exports = new AddBounty();

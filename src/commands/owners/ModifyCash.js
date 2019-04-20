const { Command, Argument, ArgumentDefault } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class ModifyCash extends Command {
  constructor() {
    super({
      names: ['modifycash', 'modcash'],
      groupName: 'owners',
      description: 'Allows you to modify the cash of any member.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'amount',
          example: '500'
        }),
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: ArgumentDefault.Member,
          example: 'Supa Hot Fire#0911',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = await msg.client.db.userRepo.modifyCash(msg.dbGuild, args.member, args.amount);

    return msg.createReply(`you have successfully modifed \
${args.member.id === msg.author.id ? 'your' : `${StringUtil.boldify(args.member.user.tag)}'s`} \
balance to ${NumberUtil.format(dbUser.cash)}.`);
  }
}

module.exports = new ModifyCash();

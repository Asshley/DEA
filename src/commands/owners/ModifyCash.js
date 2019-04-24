const { Command, Argument, ArgumentDefault } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
    const dbUser = await msg._client.db.userRepo.modifyCash(msg.dbGuild, args.member, args.amount);

    return msg.createReply(StringUtil.format(
      messages.commands.modifyCash,
      args.member.id === msg.author.id ? 'your' : `${StringUtil
        .boldify(`${args.member.user.username}#${args.member.user.discriminator}`)}'s`,
      NumberUtil.format(dbUser.cash)
    ));
  }
}

module.exports = new ModifyCash();

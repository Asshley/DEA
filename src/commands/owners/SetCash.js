const { Command, Argument, ArgumentDefault } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class SetCash extends Command {
  constructor() {
    super({
      names: ['setcash'],
      groupName: 'owners',
      description: 'Allows you to set the cash of any member.',
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
    const cash = NumberUtil.fromValue(args.amount);
    const update = { $set: { cash } };
    const dbUser = await msg._client.db.userRepo.updateUser(args.member.id, msg.guildID, update);

    return msg.createReply(StringUtil.format(
      messages.commands.modifyCash,
      args.member.id === msg.author.id ? 'your' : `${StringUtil
        .boldify(`${args.member.user.username}#${args.member.user.discriminator}`)}'s`,
      NumberUtil.toUSD(args.amount)
    ));
  }
}

module.exports = new SetCash();

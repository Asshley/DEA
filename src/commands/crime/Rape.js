const { Command, Argument } = require('patron.js');
const {
  COOLDOWNS: { RAPE: RAPE_COOLDOWN },
  ODDS: { RAPE: RAPE_ODDS },
  RESTRICTIONS: { COMMANDS: { RAPE: { CASH_REQUIRED, AMOUNT } } }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const Random = require('../../utility/Random.js');
const messages = require('../../data/messages.json');

class Rape extends Command {
  constructor() {
    super({
      names: ['rape'],
      groupName: 'crime',
      description: 'Rape any user.',
      cooldown: RAPE_COOLDOWN,
      postconditions: ['reducedcooldown'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'Vanalk#1231',
          preconditionOptions: [{ minimum: CASH_REQUIRED }],
          preconditions: ['hasminimumcash', 'noself']
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();

    if (roll < RAPE_ODDS) {
      const cost = msg.dbUser.cash * AMOUNT;

      await msg._client.db.userRepo.modifyCashExact(msg.dbGuild, msg.member, -cost);

      return msg.createReply(StringUtil.format(
        messages.commands.rape.failed,
        StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`),
        NumberUtil.format(cost)
      ));
    }

    const dbUser = await args.member.dbUser();
    const cost = dbUser.cash * AMOUNT;
    const costStr = NumberUtil.format(cost);

    await msg._client.db.userRepo.modifyCashExact(msg.dbGuild, args.member, -cost);
    await MessageUtil.notify(args.member, StringUtil.format(
      messages.commands.rape.dm,
      StringUtil.boldify(`${msg.author.username}#${msg.author.dimscriminator}`),
      costStr
    ), 'rape');

    return msg.createReply(StringUtil.format(
      messages.command.rape.successful,
      StringUtil.boldify(`${msg.author.username}#${msg.author.dimscriminator}`),
      costStr
    ));
  }
}

module.exports = new Rape();

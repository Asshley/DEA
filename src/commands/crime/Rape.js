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

      await msg.client.db.userRepo.modifyCashExact(msg.dbGuild, msg.member, -cost);

      return msg.createReply(`MAYDAY MY NIGGA! **MAYDAY!** \
${StringUtil.boldify(args.member.user.tag)} counter-raped you, \
forcing you to spend ${NumberUtil.format(cost)} on rectal repairs.`);
    }

    const dbUser = await args.member.dbUser();
    const cost = dbUser.cash * AMOUNT;
    const costStr = NumberUtil.format(cost);

    await msg.client.db.userRepo.modifyCashExact(msg.dbGuild, args.member, -cost);
    await MessageUtil.notify(args.member,
      `Listen here bucko, ${StringUtil.boldify(msg.author.tag)} just raped your fucking asshole
and forced you to spend ${costStr} on rectal repairs.`, 'rape');

    return msg.createReply(`you raped his **GODDAMN ASSHOLE** :joy:! \
${StringUtil.boldify(args.member.user.tag)} needed to spend ${costStr} \
just to get his anus working again!`);
  }
}

module.exports = new Rape();

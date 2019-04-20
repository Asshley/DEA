const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Util = require('../../utility/Util.js');

class Shop extends Command {
  constructor() {
    super({
      names: ['shop', 'buy'],
      groupName: 'items',
      description: 'Buy a crate.',
      args: [
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: '"gold crate"',
          preconditionOptions: [{ types: ['crate'] }],
          preconditions: ['nottype']
        }),
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '2',
          defaultValue: 1,
          preconditionOptions: [{ minimum: 1 }],
          preconditions: ['minimum'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const [name] = args.item.names;
    const item = `inventory.${name}`;
    const cost = args.item.price * args.amount;
    const plural = `${Util.pluralize(name, args.amount)}`;

    if (NumberUtil.value(msg.dbUser.cash) < cost) {
      return msg.createErrorReply(`you need ${NumberUtil.toUSD(cost)} to buy ${plural}.`);
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, {
      $inc: {
        [item]: args.amount
      }
    });
    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -cost);

    return msg.createReply(`you have successfully purchased ${args.amount} ${plural}.`);
  }
}

module.exports = new Shop();

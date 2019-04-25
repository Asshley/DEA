const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const messages = require('../../../data/messages.json');

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
      return msg.createErrorReply(StringUtil.format(
        messages.commands.shop.needMoney, NumberUtil.toUSD(cost), plural
      ));
    }

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: {
        [item]: args.amount
      }
    });
    await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -cost);

    return msg.createReply(StringUtil.format(
      messages.commands.shop.success, args.amount, plural
    ));
  }
}

module.exports = new Shop();

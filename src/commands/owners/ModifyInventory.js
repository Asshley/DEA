const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class ModifyInventory extends Command {
  constructor() {
    super({
      names: ['modifyinventory', 'modifyinv', 'modinv'],
      groupName: 'owners',
      description: 'Allows you to modify the inventory of any member.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '5'
        }),
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'bear grylls meat'
        }),
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: ArgumentDefault.Member,
          example: 'bigdaddy#4000'
        })
      ]
    });
  }

  async run(msg, args) {
    const inventory = `inventory.${args.item.names[0]}`;
    const update = {
      $inc: {
        [inventory]: args.amount
      }
    };

    await msg._client.db.userRepo.updateUser(args.member.id, msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.modifyInventory,
      args.member.id === msg.author.id ? 'your' : `${StringUtil
        .boldify(`${args.member.user.username}#${args.member.user.discriminator}`)}'s`
    ));
  }
}

module.exports = new ModifyInventory();

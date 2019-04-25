const { Command, Argument } = require('patron.js');
const itemService = require('../../services/ItemService.js');
const StringUtil = require('../../utility/StringUtil.js');
const items = require('../../../data/items.json');
const messages = require('../../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');

class OpenCrate extends Command {
  constructor() {
    super({
      names: ['opencrate', 'open'],
      groupName: 'items',
      description: 'Open a crate.',
      postconditions: ['reducedcooldown'],
      cooldown: cooldowns.commands.openCrate,
      args: [
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'bronze crate',
          preconditionOptions: [{ types: ['crate'] }],
          preconditions: ['nottype', 'needitem'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const [name] = args.item.names;
    const cases = `inventory.${name}`;
    const item = itemService.openCrate(args.item, items);
    const gained = `inventory.${item.names[0]}`;

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: {
        [gained]: 1, [cases]: -1
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.openCrate, StringUtil.capitialize(item.names[0])
    ));
  }
}

module.exports = new OpenCrate();

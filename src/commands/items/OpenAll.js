const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { OPEN_ALL: MAX_OPENABLE }
} = require('../../utility/Constants.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const itemService = require('../../services/ItemService.js');
const items = require('../../../data/items.json');
const messages = require('../../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');
const DELAY = 5e3;

class OpenAll extends Command {
  constructor() {
    super({
      names: ['openall'],
      groupName: 'items',
      description: 'Open all of a kind of crate.',
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
    let reply = '';
    let openAmount = 0;

    if (msg.dbUser.inventory[name] > MAX_OPENABLE) {
      const openCap = await msg.createReply(StringUtil.format(
        messages.commands.openAll.max, MAX_OPENABLE
      ));

      await openCap.delete(DELAY);
      openAmount = MAX_OPENABLE;
    } else {
      openAmount = msg.dbUser.inventory[name];
    }

    const item = itemService.massOpenCrate(openAmount, args.item, items);
    const keys = Object.keys(item);
    const object = { $inc: {} };

    object.$inc[cases] = -openAmount;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const plural = Util.pluralize(key, item[key]);

      reply += StringUtil.format(
        messages.commands.openAll.message, StringUtil.capitialize(plural), item[key]
      );
      object.$inc[`inventory.${key}`] = item[key];
    }

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, object);

    return msg.channel.sendMessage(reply, {
      title: `${msg.author.username}#${msg.author.discriminator} has won`
    });
  }
}

module.exports = new OpenAll();

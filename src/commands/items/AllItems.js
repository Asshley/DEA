const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const items = require('../../data/items.json');

class AllItems extends Command {
  constructor() {
    super({
      names: ['items', 'allitems'],
      groupName: 'items',
      description: 'View all items.'
    });
  }

  async run(msg) {
    let reply = '';

    for (let i = 0; i < items.length; i++) {
      let str = StringUtil.capitialize(items[i].names[0]);
      const key = items[i].type === 'bullet' ? 'ammo' : items[i].type;
      const newType = !items[i - 1] || items[i - 1].type !== items[i].type;

      if (newType) {
        reply += `${StringUtil.boldify(StringUtil.capitialize(key))}\n`;
      }

      const sameType = items[i + 1] && items[i + 1].type === items[i].type;

      str += items.length - 1 !== i && sameType ? ', ' : '\n';
      reply += str;
    }

    return msg.channel.sendMessage(reply, { title: 'All Items' });
  }
}

module.exports = new AllItems();

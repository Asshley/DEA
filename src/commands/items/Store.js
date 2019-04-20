const { Command } = require('patron.js');
const items = require('../../data/items.json');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Store extends Command {
  constructor() {
    super({
      names: ['store'],
      groupName: 'items',
      description: 'Display\'s the purchasable items within the shop.'
    });
  }

  async run(msg) {
    const crates = items.filter(x => x.price);
    let reply = '';

    for (let i = 0; i < crates.length; i++) {
      const crate = crates[i];

      reply += `**${StringUtil.capitialize(crate.names[0])}:** ${NumberUtil.toUSD(crate.price)}\n`;
    }

    return msg.channel.createMessage(reply, { title: 'Purchasable Items' });
  }
}

module.exports = new Store();

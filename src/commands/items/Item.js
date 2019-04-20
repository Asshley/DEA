const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Item extends Command {
  constructor() {
    super({
      names: [
        'item',
        'weapon',
        'meat',
        'gun',
        'knife'
      ],
      groupName: 'items',
      description: 'Search for an item\'s information.',
      args: [
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'bear grylls meat',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const keys = Object.keys(args.item);
    let reply = '';

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = args.item[key];

      if (key === 'price') {
        reply += `**Price:** ${NumberUtil.toUSD(value)}\n`;
      } else if (key === 'description') {
        reply += `**Description:** ${value}\n`;
      } else if (key !== 'names') {
        reply += `**${StringUtil.capitialize(key)}:** ${StringUtil.capitialize(`${value}`)}\n`;
      }
    }

    return msg.channel.createMessage(reply, { title: StringUtil.capitialize(args.item.names[0]) });
  }
}

module.exports = new Item();

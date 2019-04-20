const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');

class Inventory extends Command {
  constructor() {
    super({
      names: ['inv', 'inventory'],
      groupName: 'items',
      description: 'See a user\'s inventory.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: ArgumentDefault.Member,
          example: 'Blast It Baby#6969',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = args.member.id === msg.member.id ? msg.dbUser : await args.member.dbUser();
    const keys = Object.keys(dbUser.inventory);
    let reply = '';

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const plural = Util.pluralize(keys[i], dbUser.inventory[key]);

      if (dbUser.inventory[key]) {
        reply += `${StringUtil.capitialize(plural)}: ${dbUser.inventory[key]}\n`;
      }
    }

    if (StringUtil.isNullOrWhiteSpace(reply)) {
      return msg.channel.createErrorMessage(`${StringUtil.boldify(args.member.user.tag)} \
has nothing in their inventory.`);
    }

    return msg.channel.createMessage(reply, { title: `${args.member.user.tag}'s Inventory:` });
  }
}

module.exports = new Inventory();

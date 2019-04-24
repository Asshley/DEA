const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const messages = require('../../data/messages.json');

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
        reply += StringUtil.format(
          messages.commands.inventory.message, StringUtil.capitialize(plural), dbUser.inventory[key]
        );
      }
    }

    const tag = `${args.member.user.username}#${args.member.user.discriminator}`;

    if (StringUtil.isNullOrWhiteSpace(reply)) {
      return msg.channel.createErrorMessage(StringUtil.format(
        messages.commands.inventory.none, StringUtil.boldify(tag)
      ));
    }

    return msg.channel.sendMessage(reply, { title: `${tag}'s Inventory:` });
  }
}

module.exports = new Inventory();

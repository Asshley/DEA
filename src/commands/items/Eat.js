const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { HEALTH: MAX_HEALTH }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Eat extends Command {
  constructor() {
    super({
      names: ['eat'],
      groupName: 'items',
      description: 'Eat food in your inventory.',
      args: [
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'beef',
          preconditionOptions: [{ types: ['fish', 'meat'] }],
          preconditions: ['nottype', 'needitem'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const { health } = msg.dbUser;
    const amount = args.item.health + health > MAX_HEALTH ? MAX_HEALTH : args.item.health + health;
    const update = {
      $set: {
        health: amount
      }
    };

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, update);

    const food = `inventory.${args.item.names[0]}`;

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: { [food]: -1 }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.eat,
      StringUtil.capitialize(args.items.names[0]),
      args.item.health,
      amount
    ));
  }
}

module.exports = new Eat();

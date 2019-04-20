const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { HEALTH: MAX_HEALTH }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');

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
          preconditions: ['nottype', 'donthave'],
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

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, update);

    const food = `inventory.${args.item.names[0]}`;

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: { [food]: -1 } });

    return msg.createReply(`You ate: ${StringUtil.capitialize(args.item.names[0])} increasing your \
health by ${args.item.health}. Health: ${amount}.`);
  }
}

module.exports = new Eat();

const { Command, Argument } = require('patron.js');
const {
  MESSAGES: { BROKEN_ITEM, FISH: { CAUGHT, LOST } },
  COOLDOWNS: { FISH: FISH_COOLDOWN }
} = require('../../utility/Constants.js');
const itemService = require('../../services/ItemService.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const items = require('../../data/items.json');

class Fish extends Command {
  constructor() {
    super({
      names: ['fish'],
      groupName: 'items',
      description: 'Go fishing using items.',
      postconditions: ['reducedcooldown'],
      cooldown: FISH_COOLDOWN,
      args: [
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'huntsman knife',
          preconditionOptions: [{ types: ['knife', 'gun'] }],
          preconditions: ['nottype', 'donthave'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const broken = await itemService.break(msg.client.db, msg.guild, msg.author, args.item);

    if (broken) {
      const response = StringUtil.format(
        Random.arrayElement(BROKEN_ITEM), StringUtil.boldify(args.item.names[0])
      );

      return msg.createErrorReply(response);
    }

    const caught = itemService.fish(args.item, items);
    let update = null;
    let reply = '';

    if (caught) {
      const [name] = caught.names;
      const gained = `inventory.${name}`;

      update = {
        $inc: {
          [gained]: 1
        }
      };
      reply = StringUtil.format(CAUGHT, StringUtil.capitialize(name));
    } else {
      reply = LOST;
    }

    if (args.item.type === 'gun') {
      if (update) {
        update.$inc[`inventory.${args.item.bullet}`] = -1;
      } else {
        update = {
          $inc: {
            [`inventory.${args.item.bullet}`]: -1
          }
        };
      }
    }

    if (update) {
      await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, update);
    }

    return msg.createReply(reply);
  }
}

module.exports = new Fish();

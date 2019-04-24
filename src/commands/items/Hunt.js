const { Command, Argument } = require('patron.js');
const {
  COOLDOWNS: { HUNT: HUNT_COOLDOWN }
} = require('../../utility/Constants.js');
const itemService = require('../../services/ItemService.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const items = require('../../data/items.json');
const messages = require('../../data/messages.json');

class Hunt extends Command {
  constructor() {
    super({
      names: ['hunt'],
      groupName: 'items',
      description: 'Go hunting using items.',
      postconditions: ['reducedcooldown'],
      cooldown: HUNT_COOLDOWN,
      args: [
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'intervention',
          preconditionOptions: [{ types: ['gun', 'knife'] }],
          preconditions: ['nottype', 'needitem'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const broken = await itemService
      .break(msg._client.db, msg.channel.guild, msg.author, args.item);

    if (broken) {
      return msg.createErrorReply(StringUtil.format(
        Random.arrayElement(messages.commands.hunt.broken), args.item.names[0]
      ));
    }

    const caught = itemService.hunt(args.item, items);
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
      reply = StringUtil.format(messages.commands.hunt.caught, StringUtil.capitialize(name));
    } else {
      reply = messages.commands.hunt.lost;
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
      await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, update);
    }

    return msg.createReply(reply);
  }
}

module.exports = new Hunt();

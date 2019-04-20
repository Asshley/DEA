const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { VAULT: { UNIQUE_ITEMS, ITEMS: MAX_ITEMS } },
  MESSAGES: { VAULT }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const Util = require('../../utility/Util.js');

class AddToVault extends Command {
  constructor() {
    super({
      names: ['addtovault', 'addvault', 'deposititem', 'addtogang'],
      groupName: 'gangs',
      description: 'Add an item to a gangs vault.',
      preconditions: ['ingang'],
      args: [
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'intervention',
          preconditions: ['donthave']
        }),
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '2',
          defaultValue: 1,
          preconditionOptions: [
            { minimum: 1 },
            {},
            {
              maxUnique: UNIQUE_ITEMS, maxAmount: MAX_ITEMS
            }
          ],
          preconditions: ['minimum', 'userhasamount', 'maxvaultitems'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const [name] = args.item.names;
    const inv = `inventory.${name}`;
    const vault = `vault.${name}`;
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === msg.dbGang.name);

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, {
      $inc: { [inv]: -args.amount }
    });
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $inc: {
        [`gangs.${gangIndex}.${vault}`]: args.amount
      }
    });

    const leader = msg.guild.members.get(msg.dbGang.leaderId);
    const format = Util.pluralize(StringUtil.upperFirstChar(name), args.amount);

    await MessageUtil.notify(
      leader,
      StringUtil.format(VAULT.ADD_DM, StringUtil.boldify(msg.author.tag), args.amount, format),
      'addvaultitem'
    );

    return msg.createReply(StringUtil.format(VAULT.ADD_REPLY, args.amount, format));
  }
}

module.exports = new AddToVault();

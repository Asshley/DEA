const { Command, Argument } = require('patron.js');
const {
  COOLDOWNS: { TAKE_FROM_VAULT: VAULT_COOLDOWN }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const MessageUtil = require('../../utility/MessageUtil.js');

class TakeFromVault extends Command {
  constructor() {
    super({
      names: [
        'takefromvault',
        'takevault',
        'takeitem',
        'takefromgang',
        'withdrawitem',
        'yoink'
      ],
      groupName: 'gangs',
      description: 'Take an item from a gang\'s vault.',
      postconditions: ['reducedcooldown'],
      cooldown: VAULT_COOLDOWN,
      preconditions: ['ingang'],
      args: [
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'intervention',
          preconditions: ['notinvault']
        }),
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '2',
          defaultValue: 1,
          preconditionOptions: [{ minimum: 1 }, { maximum: 5 }],
          preconditions: ['minimum', 'maximum', 'vaulthasamount'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const [name] = args.item.names;
    const inv = `inventory.${name}`;
    const vault = `vault.${name}`;
    const gang = msg.dbGang;
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, {
      $inc: {
        [inv]: args.amount
      }
    });
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $inc: {
        [`gangs.${gangIndex}.${vault}`]: -args.amount
      }
    });

    const leader = msg.guild.members.get(gang.leaderId);
    const format = `${args.amount} ${Util.pluralize(name, args.amount)}`;

    await MessageUtil.notify(leader, `${StringUtil.boldify(msg.author.tag)} has just taken \
${format} gang's vault.`, 'takevaultitem');

    return msg.createReply(`you have successfully taken ${format} from your gang's vault.`);
  }
}

module.exports = new TakeFromVault();

const { Command, Argument } = require('patron.js');
const {
  ODDS: { RAID: RAID_ODDS },
  COOLDOWNS: { RAID: RAID_COOLDOWN },
  RESTRICTIONS: { COMMANDS: { GANG: { MINIMUM_AMOUNT } } },
  MAX_AMOUNTS: { GANG: { MEMBERS: MAX_MEMBERS } },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT: ROUND, TO_PERCENT_AMOUNT }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const DOUBLE = 2;

class Raid extends Command {
  constructor() {
    super({
      names: ['raid'],
      groupName: 'gangs',
      description: 'Raid another gang\'s money.',
      postconditions: ['reducedcooldown', 'pergangraid'],
      cooldown: RAID_COOLDOWN,
      preconditions: ['ingang'],
      args: [
        new Argument({
          name: 'amount',
          key: 'raid',
          type: 'amount',
          example: '500',
          preconditionOptions: [{ minimum: MINIMUM_AMOUNT }],
          preconditions: ['minimumcash', 'raidamount']
        }),
        new Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          preconditions: ['argraidamount', 'notowngang', 'raid'],
          example: 'best gang ever',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();
    const gang = msg.dbGang;
    const gangLeader = msg.guild.members.get(gang.leaderId);
    const raidedGangLeader = msg.guild.members.get(args.gang.leaderId);
    const membersDeduction = args.gang.members.length * (MAX_MEMBERS + 1);
    const stolen = args.raid * DOUBLE;
    const formattedStolen = NumberUtil.toUSD(stolen);
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const intial = msg.author.id === gang.leaderId ? 'You have' : `${StringUtil
      .boldify(msg.author.tag)} has`;

    if (roll < RAID_ODDS - membersDeduction) {
      await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
        $inc: {
          [`gangs.${gangIndex}.wealth`]: NumberUtil.round(stolen * TO_PERCENT_AMOUNT, ROUND)
        }
      });

      const opGangIndex = msg.dbGuild.gangs.findIndex(x => x.name === args.gang.name);

      await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
        $inc: {
          [`gangs.${opGangIndex}.wealth`]: NumberUtil.round(-stolen * TO_PERCENT_AMOUNT, ROUND)
        }
      });
      await MessageUtil.notify(gangLeader, `${intial} raided ${formattedStolen} from \
${StringUtil.boldify(args.gang.name)}.`, 'raid');
      await MessageUtil.notify(raidedGangLeader, `${StringUtil.boldify(gang.name)} has raided \
${formattedStolen} from your gang.`, 'raided');

      return msg.createReply(`you've successfully raided ${formattedStolen} \
from ${StringUtil.boldify(args.gang.name)}.`);
    }

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $inc: {
        [`gangs.${gangIndex}.wealth`]: NumberUtil.round(-args.raid * TO_PERCENT_AMOUNT, ROUND)
      }
    });
    await MessageUtil.notify(gangLeader, `${intial} attempted to raid ${formattedStolen} from \
${StringUtil.boldify(args.gang.name)} but you failed horribly.`, 'raid');
    await MessageUtil.notify(raidedGangLeader, `${StringUtil.boldify(gang.name)} has attempted to \
raid ${formattedStolen} from your gang but failed horribily.`, 'raided');

    return msg.createErrorReply(`unfortunately your gang has failed to raid ${formattedStolen} \
from ${StringUtil.boldify(args.gang.name)}.`);
  }
}

module.exports = new Raid();

const { Command, Argument } = require('patron.js');
const {
  ODDS: { RAID: RAID_ODDS },
  RESTRICTIONS: { COMMANDS: { GANG: { MINIMUM_AMOUNT } } },
  MAX_AMOUNTS: { GANG: { MEMBERS: MAX_MEMBERS } },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT: ROUND, TO_PERCENT_AMOUNT }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const DOUBLE = 2;
const messages = require('../../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');

class Raid extends Command {
  constructor() {
    super({
      names: ['raid'],
      groupName: 'gangs',
      description: 'Raid another gang\'s money.',
      postconditions: ['reducedcooldown', 'pergangraid'],
      cooldown: cooldowns.commands.raid,
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
          preconditions: ['argumentraidamount', 'notowngang', 'raid'],
          example: 'best gang ever',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const roll = Random.roll();
    const gang = msg.dbGang;
    const gangLeader = msg.channel.guild.members.get(gang.leaderId);
    const raidedGangLeader = msg.channel.guild.members.get(args.gang.leaderId);
    const membersDeduction = args.gang.members.length * (MAX_MEMBERS + 1);
    const stolen = args.raid * DOUBLE;
    const formattedStolen = NumberUtil.toUSD(stolen);
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const initial = msg.author.id === gang.leaderId ? 'You have' : `${StringUtil
      .boldify(`${msg.author.username}#${msg.author.discriminator}`)} has`;

    if (roll < RAID_ODDS - membersDeduction) {
      await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
        $inc: {
          [`gangs.${gangIndex}.wealth`]: NumberUtil.round(stolen * TO_PERCENT_AMOUNT, ROUND)
        }
      });

      const opGangIndex = msg.dbGuild.gangs.findIndex(x => x.name === args.gang.name);

      await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
        $inc: {
          [`gangs.${opGangIndex}.wealth`]: NumberUtil.round(-stolen * TO_PERCENT_AMOUNT, ROUND)
        }
      });

      return this.inform(msg, true, initial, formattedStolen, {
        leader: gangLeader, gang: args.gang.name
      },
      {
        leader: raidedGangLeader, gang: gang.name
      });
    }

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $inc: {
        [`gangs.${gangIndex}.wealth`]: NumberUtil.round(-args.raid * TO_PERCENT_AMOUNT, ROUND)
      }
    });

    return this.inform(msg, false, initial, formattedStolen, {
      leader: gangLeader, gang: args.gang.name
    },
    {
      leader: raidedGangLeader, gang: gang.name
    });
  }

  async inform(msg, success, prepend, amount, raider, raided) {
    if (success) {
      await MessageUtil.notify(raider.leader, StringUtil.format(
        messages.commands.raid.raidedDM, prepend, amount, raider.gang
      ), 'raid');
      await MessageUtil.notify(raided.leader, StringUtil.format(
        messages.commands.raid.DM, raided.gang, amount
      ), 'raided');

      return msg.createReply(StringUtil.format(
        messages.commands.raid.reply, amount, raider.gang
      ));
    }

    await MessageUtil.notify(raider.leader, StringUtil.format(
      messages.commands.raid.failedRaidedDM, prepend, amount, raider.gang
    ), 'raid');
    await MessageUtil.notify(raided.leader, StringUtil.format(
      messages.commands.raid.failedDM, raided.gang, amount
    ), 'raided');

    return msg.createErrorReply(StringUtil.format(
      messages.commands.raid.failedReply, amount, raider.gang
    ));
  }
}

module.exports = new Raid();

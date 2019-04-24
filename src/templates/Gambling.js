const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { GAMBLING },
  MAX_AMOUNTS: { GAMBLE_CHANNELS_SHOWN },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT: ROUND }
} = require('../utility/Constants.js');
const Random = require('../utility/Random.js');
const NumberUtil = require('../utility/NumberUtil.js');
const StringUtil = require('../utility/StringUtil.js');
const messages = require('../data/messages.json');

class Gambling extends Command {
  constructor(names, description, odds, payoutMultiplier, preconditions = []) {
    super({
      names,
      groupName: 'gambling',
      description,
      preconditions,
      args: [
        new Argument({
          name: 'bet',
          key: 'bet',
          type: 'cash',
          example: '500',
          preconditionOptions: [{ minimum: GAMBLING.MINIMUM_BET }],
          preconditions: ['minimumcash', 'cash']
        })
      ]
    });
    this.odds = odds;
    this.payoutMultiplier = payoutMultiplier;
  }

  async run(msg, args) {
    const gamblingChannels = msg.dbGuild.channels.gamble;

    if (gamblingChannels.length && !msg.dbGuild.channels.gamble.includes(msg.channel.id)) {
      const channels = msg.dbGuild.channels.gamble
        .slice(0, GAMBLE_CHANNELS_SHOWN).map(x => `<#${x}>`).join(', ');

      return msg.createErrorReply(StringUtil.format(
        messages.commands.gambling.gamblingChannels, channels
      ));
    }

    const roll = Random.roll();

    if (roll >= this.odds) {
      const winnings = args.bet * this.payoutMultiplier;
      const res = await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, winnings);

      return msg.createReply(StringUtil.format(
        messages.commands.gambling.successful,
        roll.toFixed(ROUND),
        NumberUtil.toUSD(winnings),
        NumberUtil.format(res.cash)
      ));
    }

    const res = await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.bet);

    return msg.createReply(StringUtil.format(
      messages.commands.gambling.failed,
      roll.toFixed(ROUND),
      NumberUtil.toUSD(args.bet),
      NumberUtil.format(res.cash)
    ));
  }
}

module.exports = Gambling;

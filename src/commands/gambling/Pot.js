const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { POT: { MAXIMUM_MEMBERS, MINIMUM_CASH } } },
  MISCELLANEA: { POT_EXPIRES }
} = require('../../utility/Constants.js');
const PAD_AMOUNT = 2;
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const PotUtil = require('../../utility/PotUtil.js');
const messages = require('../../../data/messages.json');

class Pot extends Command {
  constructor() {
    super({
      names: ['pot'],
      groupName: 'gambling',
      description: 'View a pot or add money to an existing pot.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'cash',
          example: '2k',
          preconditions: ['finiteamount', 'minimumcash', 'cash'],
          preconditionOptions: [{}, { minimum: MINIMUM_CASH }],
          defaultValue: 'null'
        })
      ]
    });
    this.pots = {};
  }

  async run(msg, args) {
    const pot = this.pots[msg.channel.guild.id];

    if (args.amount === 'null') {
      if (!pot) {
        return msg.createErrorReply(messages.commands.pot.inactive);
      }

      const { response, options } = this.potInfo(pot, msg._client);

      return msg.channel.sendMessage(response, options);
    } else if (!pot) {
      await this.createPot(msg.member, msg.dbGuild, args.amount, msg.channel);

      return msg.createReply(StringUtil.format(
        messages.commands.pot.created, NumberUtil.toUSD(args.amount)
      ));
    }

    const totalCash = pot.value;

    if (!Number.isFinite(totalCash + args.amount)) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.pot.maxCapacity, NumberUtil.toUSD(args.amount)
      ));
    }

    const existing = pot.members.some(x => x.id === msg.author.id);

    if (!existing && pot.members.length >= MAXIMUM_MEMBERS) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.pot.maxMembers, MAXIMUM_MEMBERS
      ));
    }

    const member = pot.addMoney(msg.author, args.amount);

    await msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.amount);

    return msg.createReply(StringUtil.format(
      messages.commands.pot.deposited,
      NumberUtil.toUSD(args.amount),
      NumberUtil.toUSD(member.deposited)
    ));
  }

  async createPot(member, dbGuild, amount, channel) {
    const pot = PotUtil.from({
      member: member.id,
      channel: channel.id
    });
    const potMember = pot.addMember(member, amount);

    this.pots[member.guild.id] = pot;
    await member.guild.shard.client.db.userRepo.modifyCash(dbGuild, member, -amount);

    return potMember;
  }

  potInfo(pot, client) {
    const response = pot.members.sort((a, b) => b.deposited - a.deposited).map(x => {
      const user = client.users.get(x.id);
      const amount = NumberUtil.toUSD(x.deposited);
      const odds = PotUtil.getOdds(pot, x.id);
      const tag = `${user.username}#${user.discriminator}`;

      return `${tag}: ${amount} (${odds}%)`;
    }).join('\n');
    const currentTime = Date.now();
    let timeLeft = '';

    if (pot.expired) {
      timeLeft = ' | Drawing soon!';
    } else if (pot.readyAt) {
      const msLeft = currentTime - pot.readyAt;
      const { minutes, seconds } = NumberUtil.msToTime(POT_EXPIRES - msLeft);

      timeLeft = ` | ${StringUtil.pad(minutes, PAD_AMOUNT)}:${StringUtil.pad(seconds, PAD_AMOUNT)}`;
    }

    const { username, discriminator } = client.users.get(pot.owner);
    const options = {
      title: `Current Pot - ${username}#${discriminator}`,
      footer: {
        text: `${NumberUtil.toUSD(pot.value)}${timeLeft}`
      }
    };

    return {
      response,
      options
    };
  }
}

module.exports = new Pot();

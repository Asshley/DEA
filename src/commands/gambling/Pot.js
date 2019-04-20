const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { POT: { MAXIMUM_MEMBERS, MINIMUM_CASH } } },
  MISCELLANEA: { POT_EXPIRES }
} = require('../../utility/Constants.js');
const { Collection } = require('discord.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const _Pot = require('../../structures/Pot.js');
const PAD_AMOUNT = 2;

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
    this.pots = new Collection();
  }

  async run(msg, args) {
    const pot = this.pots.get(msg.guild.id);

    if (args.amount === 'null') {
      if (!pot) {
        return msg.createErrorReply('there is no active pot in this server.');
      }

      const { response, options } = this.potInfo(pot, msg.client);

      return msg.channel.createMessage(response, options);
    } else if (!pot) {
      await this.createPot(msg.member, msg.dbGuild, args.amount, msg.channel);

      return msg.createReply(`you've successfully created a new pot \
starting with ${NumberUtil.toUSD(args.amount)}.`);
    }

    const totalCash = _Pot.totalCash(pot);

    if (!Number.isFinite(totalCash + args.amount)) {
      return msg.createErrorReply(`adding ${NumberUtil.toUSD(args.amount)} will make the \
pot hold too much cash.`);
    }

    const existing = pot.members.some(x => x.id === msg.author.id);

    if (!existing && pot.members.length >= MAXIMUM_MEMBERS) {
      return msg.createErrorReply(`there can only be ${MAXIMUM_MEMBERS} participants in a pot.`);
    }

    const member = pot.addMoney(msg.author, args.amount);

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, -args.amount);

    return msg.createReply(`you've successfully added ${NumberUtil.toUSD(args.amount)} to \
the pot, making your total amount deposited ${NumberUtil.toUSD(member.deposited)}.`);
  }

  async createPot(member, dbGuild, amount, channel) {
    const pot = new _Pot(member.id, channel.id);
    const potMember = pot.addMember(member, amount);

    this.pots.set(member.guild.id, pot);
    await member.client.db.userRepo.modifyCash(dbGuild, member, -amount);

    return potMember;
  }

  potInfo(pot, client) {
    const response = pot.members.sort((a, b) => b.deposited - a.deposited).map(x => {
      const user = client.users.get(x.id);
      const amount = NumberUtil.toUSD(x.deposited);
      const odds = _Pot.calculateOdds(pot, x.id);

      return `${user.tag}${pot.owner === x.id ? ' (Creator)' : ''}: ${amount} (${odds}%)`;
    }).join('\n');
    const currentTime = Date.now();
    let timeLeft = '';

    if (pot.expired) {
      timeLeft = ' | Expiring soon!';
    } else if (pot.readyAt) {
      const msLeft = currentTime - pot.readyAt;
      const { minutes, seconds } = NumberUtil.msToTime(POT_EXPIRES - msLeft);

      timeLeft = ` | ${StringUtil.pad(minutes, PAD_AMOUNT)}:${StringUtil.pad(seconds, PAD_AMOUNT)}`;
    }

    const options = {
      title: 'Current Pot',
      footer: {
        text: `${NumberUtil.toUSD(_Pot.totalCash(pot))}${timeLeft}`
      }
    };

    return {
      response,
      options
    };
  }
}

module.exports = new Pot();

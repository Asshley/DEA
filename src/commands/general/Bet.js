const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: {
    TRANSFER: { MINIMUM_CASH },
    COMMANDS: { BET: { MAX_NUMBERS, MAX_VALUE, MIN_NUMBERS, MIN_VALUE } }
  }
} = require('../../utility/Constants.js');
const { MULTI_MUTEX } = require('../../utility/Util.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const PromiseUtil = require('../../utility/PromiseUtil.js');
const DELAY = 3000;
const OPERATIONS = ['*', '+', '-'];

class Bet extends Command {
  constructor() {
    super({
      names: ['bet'],
      groupName: 'general',
      description: 'Solve a math problem for some easy cash.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'b1nzy#1337',
          preconditions: ['noself']
        }),
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'cash',
          example: 'all',
          preconditionOptions: [{ minimum: MINIMUM_CASH }],
          preconditions: ['minimumcash', 'cash', 'userhascash']
        })
      ]
    });
    this.activeBets = [];
  }

  async run(msg, args) {
    if (await this.isInGame(msg.author, args.member, msg)) {
      return;
    }

    const verified = await MULTI_MUTEX
      .sync(`${msg.guild.id}-bet`, () => this.verify(msg, msg.member, args.member));

    if (!verified.success) {
      if (verified.reason === 'no response') {
        return msg.createErrorReply('your opponent has not agreed to the bet.');
      }
    }

    const index = this.activeBets.push({
      id: msg.author.id,
      guild: msg.guild.id,
      opponent: args.member.id
    }) - 1;

    await msg.createReply('the bet will be starting shortly.');
    await PromiseUtil.delay(DELAY);
    await this.play(msg, args.member, args.amount);

    return this.activeBets.splice(index, 1);
  }

  async play(msg, opponent, amount) {
    const length = Random.nextInt(MIN_NUMBERS, MAX_NUMBERS);
    const randomNums = Array.from({ length }, () => Random.nextInt(MIN_VALUE, MAX_VALUE));
    const ops = Array.from({ length: length - 1 }, () => Random.arrayElement(OPERATIONS));
    const format = randomNums.map((x, i) => `${x} ${ops[i] || ''}`).join(' ');
    const answer = eval(format);

    await msg.createReply(`what is ${format}?`);

    const fn = m => (m.author.id === msg.author.id || m.author.id === opponent.id)
      && m.content === answer.toString();
    const result = await msg.channel.awaitMessages(fn, {
      time: 30000, max: 1
    });

    if (result.size) {
      const winner = result.first();
      const loser = winner.member.id === opponent.id ? msg.member : opponent;

      await msg.client.db.userRepo.modifyCash(msg.dbGuild, winner.member, amount);
      await msg.client.db.userRepo.modifyCash(msg.dbGuild, loser, -amount);
      await msg.channel.createMessage(`${StringUtil.boldify(winner.author.tag)} has won \
  ${NumberUtil.toUSD(amount)} for winning the bet with ${loser.user.tag}.`);
    } else {
      await msg.createErrorReply('since neither you nor your opponent answered correctly, \
    the money has been sent to help fund Vanalk\'s server.');
    }
  }

  async isInGame(challenger, opponent, msg) {
    const opponentBet = this.activeBets.find(x => x.id === opponent.id && x.guild === msg.guild.id);
    const userBet = this.activeBets.find(x => x.id === challenger && x.guild === msg.guild.id);

    if (userBet || opponentBet) {
      const { tag } = msg.client.users.get(userBet ? userBet.opponent : opponentBet.opponent);

      await msg
        .createErrorReply(`${userBet ? 'you\'re' : 'this user is'} already in a bet with ${tag}`);

      return true;
    }

    return false;
  }

  async verify(msg, challenger, opponent) {
    await msg.channel.createMessage(`${StringUtil.boldify(opponent.user.tag)}, reply with \`yes\` \
to accept the bet.`);

    const fn = m => m.author.id === opponent.id && m.content.toLowerCase() === 'yes';
    const result = await msg.channel.awaitMessages(fn, {
      time: 15000, max: 1
    });

    if (await this.isInGame(challenger, opponent, msg)) {
      return {
        success: false,
        reason: 'ingame'
      };
    } else if (!result.size) {
      return {
        success: false,
        reason: 'no response'
      };
    }

    return {
      success: true
    };
  }
}

module.exports = new Bet();

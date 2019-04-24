const { Command, Argument } = require('patron.js');
const {
  RESTRICTIONS: {
    TRANSFER: { MINIMUM_CASH },
    COMMANDS: { BET: { MAX_NUMBERS, MAX_VALUE, MIN_NUMBERS, MIN_VALUE } }
  }
} = require('../../utility/Constants.js');
const { MULTI_MUTEX } = require('../../utility/Util.js');
const DELAY = 3000;
const OPERATIONS = ['*', '+', '-'];
const { awaitMessages } = require('../../utility/MessageCollector.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Util = require('../../utility/Util.js');
const messages = require('../../data/messages.json');

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
    const inGame = await this.isInGame(msg.author, args.member, msg);

    if (inGame) {
      return;
    }

    const mutexKey = `${msg.channel.id}-${msg.author.id}-bet`;
    const verified = await MULTI_MUTEX
      .sync(mutexKey, () => this.verify(msg, msg.member, args.member));

    if (verified !== this.constructor.Response.Success) {
      if (verified === this.constructor.Response.NoReply) {
        return msg.createErrorReply(messages.commands.bet.noReply);
      }
    }

    const index = this.activeBets.push({
      id: msg.author.id,
      guild: msg.channel.guild.id,
      opponent: args.member.id
    }) - 1;

    await msg.createReply(messages.commands.bet.starting);
    await Util.delay(DELAY);
    await this.play(msg, args.member, args.amount);

    return this.activeBets.splice(index, 1);
  }

  async play(msg, opponent, amount) {
    const length = Random.nextInt(MIN_NUMBERS, MAX_NUMBERS);
    const randomNums = Array.from({ length }, () => Random.nextInt(MIN_VALUE, MAX_VALUE));
    const ops = Array.from({ length: length - 1 }, () => Random.arrayElement(OPERATIONS));
    const format = randomNums.map((x, i) => `${x} ${ops[i] || ''}`).join(' ');
    const answer = eval(format);

    await msg.createReply(StringUtil.format(messages.commands.bet.question, format));

    const fn = m => (m.author.id === msg.author.id || m.author.id === opponent.id)
      && m.content === answer.toString();
    const result = await awaitMessages(msg.channel, {
      time: 30000, max: 1, filter: fn
    });

    if (result.length) {
      const [winner] = result;
      const loser = winner.member.id === opponent.id ? msg.member : opponent;

      await msg._client.db.userRepo.modifyCash(msg.dbGuild, winner.member, amount);
      await msg._client.db.userRepo.modifyCash(msg.dbGuild, loser, -amount);

      return msg.channel.sendMessage(StringUtil.format(
        messages.commands.bet.winner,
        StringUtil.boldify(`${winner.author.username}#${winner.author.discriminator}`),
        NumberUtil.toUSD(amount),
        StringUtil.boldify(`${loser.user.username}#${loser.user.discriminator}`)
      ));
    }

    return msg.createErrorReply(messages.commands.bet.noWinner);
  }

  async isInGame(challenger, opponent, msg) {
    const opponentBet = this.activeBets
      .find(x => x.id === opponent.id && x.guild === msg.channel.guild.id);
    const userBet = this.activeBets
      .find(x => x.id === challenger.id && x.guild === msg.channel.guild.id);

    if (userBet || opponentBet) {
      const user = msg._client.users.get(userBet ? userBet.opponent : opponentBet.opponent);

      await msg.createErrorReply(StringUtil.format(
        messages.commands.bet.inGame,
        userBet ? 'you\'re' : 'this user is',
        StringUtil.boldify(`${user.username}#${user.discriminator}`)
      ));

      return true;
    }

    return false;
  }

  async verify(msg, challenger, opponent) {
    await msg.channel.sendMessage(StringUtil.format(
      messages.commands.bet.verify,
      StringUtil.boldify(`${opponent.user.username}#${opponent.user.discriminator}`)
    ));

    const fn = m => m.author.id === opponent.id && m.content.toLowerCase() === 'yes';
    const result = await awaitMessages(msg.channel, {
      time: 15000, max: 1, filter: fn
    });

    if (await this.isInGame(challenger, opponent, msg)) {
      return this.constructor.Response.InGame;
    } else if (!result.length) {
      return this.constructor.Response.NoReply;
    }

    return this.constructor.Response.Success;
  }
}
Bet.Response = {
  NoReply: Symbol('Response.NoReply'),
  InGame: Symbol('Response.InGame'),
  Success: Symbol('Response.Success')
};

module.exports = new Bet();

const { Command } = require('patron.js');
const {
  MISCELLANEA: { MAX_TRIVIA_ANSWERS },
  RESTRICTIONS: { TRIVIA }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const Random = require('../../utility/Random.js');

class Trivia extends Command {
  constructor() {
    super({
      names: ['trivia'],
      groupName: 'trivia',
      description: 'Send a random trivia question.',
      preconditions: ['moderator']
    });
  }

  async run(msg) {
    const entries = Object.entries(msg.dbGuild.trivia);

    if (!entries.length) {
      return msg.createErrorReply('this server has no trivia questions set.');
    }

    const [question, answer] = Random.arrayElement(entries);
    const prize = Random.nextFloat(TRIVIA.MINIMUM_CASH, TRIVIA.MAXIMUM_CASH);

    await msg.channel.createMessage(question, { title: 'Trivia!' });

    const res = await this.verify(msg, answer, entries, prize);

    if (res.success) {
      return msg.channel.createMessage(`Congratulations ${StringUtil.boldify(res.result
        .author.tag)} for winning ${NumberUtil.toUSD(prize)} in trivia!`);
    }

    return msg.channel.createMessage(`Damn you fuckers were that slow and retarded.
FINE I'll give you the answer it's: ${StringUtil.boldify(answer)}.`);
  }

  async verify(msg, answer, entries, prize) {
    const lowerAnswer = answer.toLowerCase();
    const fn = m => m.content.toLowerCase().includes(lowerAnswer) && entries.filter(
      x => m.content.toLowerCase().includes(x[1].toLowerCase())
    ).length <= MAX_TRIVIA_ANSWERS;
    const result = await msg.channel.awaitMessages(fn, {
      time: 90000, max: 1
    });

    if (result.size >= 1) {
      await msg.client.db.userRepo.modifyCash(msg.dbGuild, result.first().member, prize);

      return {
        success: true,
        result: result.first()
      };
    }

    return {
      success: false
    };
  }
}

module.exports = new Trivia();

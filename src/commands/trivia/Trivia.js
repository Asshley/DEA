const { Command } = require('patron.js');
const {
  MISCELLANEA: { MAX_TRIVIA_ANSWERS },
  RESTRICTIONS: { TRIVIA }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const { awaitMessages } = require('../../utility/MessageCollector.js');
const Random = require('../../utility/Random.js');
const messages = require('../../data/messages.json');

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
    const entries = Object.entries(msg.dbGuild.trivia.questions);

    if (!entries.length) {
      return msg.createErrorReply(messages.commands.trivia.none);
    }

    const [question, answer] = Random.arrayElement(entries);
    const prize = Random.nextFloat(TRIVIA.MINIMUM_CASH, TRIVIA.MAXIMUM_CASH);

    await msg.channel.sendMessage(question, { title: 'Trivia!' });

    const res = await this.verify(msg, answer, entries, prize);

    if (res) {
      return msg.channel.sendMessage(StringUtil.format(
        messages.commands.trivia.winner,
        StringUtil.boldify(`${res.author.username}#${res.author.discriminator}`),
        NumberUtil.toUSD(prize)
      ));
    }

    return msg.channel.sendMessage(StringUtil.format(
      messages.commands.trivia.failed, StringUtil.boldify(answer)
    ));
  }

  async verify(msg, answer, entries, prize) {
    const lowerAnswer = answer.toLowerCase();
    const fn = m => m.content.toLowerCase().includes(lowerAnswer) && entries.filter(
      x => m.content.toLowerCase().includes(x[1].toLowerCase())
    ).length <= MAX_TRIVIA_ANSWERS;
    const result = await awaitMessages(msg.channel, {
      filter: fn, time: 60000, max: 1
    });

    if (result.length >= 1) {
      await msg._client.db.userRepo.modifyCash(msg.dbGuild, result[0].member, prize);

      return result[0];
    }

    return null;
  }
}

module.exports = new Trivia();

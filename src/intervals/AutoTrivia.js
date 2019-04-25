const {
  RESTRICTIONS: { TRIVIA },
  MISCELLANEA: { MAX_TRIVIA_ANSWERS }
} = require('../utility/Constants.js');
const { awaitMessages } = require('../utility/MessageCollector.js');
const NumberUtil = require('../utility/NumberUtil.js');
const StringUtil = require('../utility/StringUtil.js');
const Interval = require('../structures/Interval.js');
const Random = require('../utility/Random.js');
const Util = require('../utility/Util.js');
const messages = require('../../data/messages.json');
const cooldowns = require('../../data/cooldowns.json');

class AutoTrivia extends Interval {
  constructor(client) {
    super(client, cooldowns.intervals.autoTrivia);
    this.inactives = {};
  }

  async onTick() {
    const guilds = await this.client.db.guildRepo.findMany();

    for (let i = 0; i < guilds.length; i++) {
      const entries = Object.entries(guilds[i].trivia.questions);

      if (!entries.length || !guilds[i].trivia.auto) {
        continue;
      }

      const guild = this.client.guilds.get(guilds[i].guildId);

      if (!guild || !guild.mainChannel) {
        continue;
      }

      return Util.MUTEX.sync(async () => {
        const [question, answer] = Random.arrayElement(entries);
        const prize = Random.nextFloat(TRIVIA.MINIMUM_CASH, TRIVIA.MAXIMUM_CASH);

        await guild.mainChannel.trySendMessage(question, { title: 'Trivia!' });

        const res = await this.verify(guild, guilds[i], answer, entries, prize);

        if (res) {
          await guild.mainChannel.trySendMessage(StringUtil.format(
            messages.intervals.autoTrivia,
            StringUtil.boldify(`${res.author.username}#${res.author.discriminator}`),
            NumberUtil.toUSD(prize)
          ));
        } else {
          await guild.mainChannel.trySendMessage(StringUtil.format(
            messages.intervals.autoTrivia, StringUtil.boldify(answer)
          ));
        }

        return this.autoDisable(guilds[i], guild, res);
      });
    }
  }

  async autoDisable(dbGuild, guild, success) {
    const { autoDisable } = dbGuild.trivia;

    if (!autoDisable) {
      return;
    }

    const inactiveCount = this.inactives[guild.id] || 0;

    if (success && inactiveCount) {
      this.inactives[guild.id] = 0;
    } else {
      this.inactives[guild.id] = inactiveCount + 1;

      if (this.inactives[guild.id] >= autoDisable) {
        this.inactives[guild.id] = 0;
        await this.client.db.guildRepo.updateGuild(guild.id, { $set: { 'trivia.auto': false } });

        return guild.mainChannel.trySendMessage(messages.intervals.autoTrivia.autoDisabled);
      }
    }
  }

  async verify(guild, dbGuild, answer, entries, prize) {
    const lowerAnswer = answer.toLowerCase();
    const fn = m => m.content.toLowerCase().includes(lowerAnswer) && entries.filter(
      x => m.content.toLowerCase().includes(x[1].toLowerCase())
    ).length <= MAX_TRIVIA_ANSWERS;
    const result = await awaitMessages(guild.mainChannel, {
      time: 90000, max: 1, filter: fn
    });

    if (result.length >= 1) {
      await this.client.db.userRepo.modifyCash(dbGuild, result[0].member, prize);

      return result[0];
    }

    return null;
  }
}

module.exports = AutoTrivia;

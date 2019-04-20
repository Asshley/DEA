const {
  RESTRICTIONS: { TRIVIA },
  MISCELLANEA: { MAX_TRIVIA_ANSWERS },
  COOLDOWNS
} = require('../utility/Constants.js');
const NumberUtil = require('../utility/NumberUtil.js');
const StringUtil = require('../utility/StringUtil.js');
const Interval = require('../structures/Interval.js');
const Random = require('../utility/Random.js');
const Util = require('../utility/Util.js');

class AutoTrivia extends Interval {
  constructor(client) {
    super(client, COOLDOWNS.AUTO_TRIVIA);
    this.inactives = {};
  }

  async onTick() {
    const guilds = await this.client.db.guildRepo.findMany();

    for (let i = 0; i < guilds.length; i++) {
      const entries = Object.entries(guilds[i].trivia);

      if (!entries.length || !guilds[i].autoTrivia) {
        continue;
      }

      const guild = this.client.guilds.get(guilds[i].guildId);

      if (!guild || !guild.mainChannel) {
        continue;
      }

      return Util.MUTEX.sync(async () => {
        const [question, answer] = Random.arrayElement(entries);
        const prize = Random.nextFloat(TRIVIA.MINIMUM_CASH, TRIVIA.MAXIMUM_CASH);

        await guild.mainChannel.createMessage(question, { title: 'Trivia!' });

        const res = await this.verify(guild, guilds[i], answer, entries, prize);

        await this.autoDisable(guilds[i], guild, res.success);

        if (res.success) {
          return guild.mainChannel.createMessage(`Congratulations ${StringUtil.boldify(res.result
            .author.tag)} for winning ${NumberUtil.toUSD(prize)} in trivia!`);
        }

        return guild.mainChannel.createMessage(`Damn you fuckers were that slow and retarded.
FINE I'll give you the answer, it's: ${StringUtil.boldify(answer)}.`);
      });
    }
  }

  async autoDisable(dbGuild, guild, success) {
    const autoDisable = dbGuild.autoDisableTrivia;

    if (!autoDisable) {
      return;
    }

    const inactiveCount = this.inactives[guild.id] || 0;

    if (success && inactiveCount) {
      this.inactives[guild.id] = 0;
    } else {
      this.inactives[guild.id] = inactiveCount + 1;

      if (this.inactives[guild.id] >= dbGuild.autoDisableTrivia) {
        this.inactives[guild.id] = 0;
        await this.client.db.guildRepo.updateGuild(guild.id, { $set: { autoTrivia: false } });

        return guild.mainChannel.createMessage('Auto trivia has been automatically disabled.');
      }
    }
  }

  async verify(guild, dbGuild, answer, entries, prize) {
    const lowerAnswer = answer.toLowerCase();
    const fn = m => m.content.toLowerCase().includes(lowerAnswer) && entries.filter(
      x => m.content.toLowerCase().includes(x[1].toLowerCase())
    ).length <= MAX_TRIVIA_ANSWERS;
    const result = await guild.mainChannel.awaitMessages(fn, {
      time: 90000,
      max: 1
    });

    if (result.size >= 1) {
      await this.client.db.userRepo.modifyCash(dbGuild, result.first().member, prize);

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

module.exports = AutoTrivia;

const {
  RESTRICTIONS: { TAX },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT },
  COOLDOWNS,
  ODDS
} = require('../utility/Constants.js');
const Interval = require('../structures/Interval.js');
const Random = require('../utility/Random.js');
const NumberUtil = require('../utility/NumberUtil.js');
const MessageUtil = require('../utility/MessageUtil.js');

class AutoTax extends Interval {
  constructor(client) {
    super(client, COOLDOWNS.AUTO_TAX);
  }

  async onTick() {
    const { client: { db: { guildRepo } } } = this;
    const guilds = await guildRepo.findMany();

    for (let i = 0; i < guilds.length; i++) {
      const dbGuild = guilds[i];

      for (let m = 0; m < dbGuild.gangs.length; m++) {
        await this.fine(dbGuild, dbGuild.gangs[m]);
      }
    }
  }

  async fine(dbGuild, gang) {
    const { wealth, leaderId, name: gangName } = gang;

    if (NumberUtil.value(wealth) < TAX.MINIMUM_WEALTH) {
      return;
    }

    if (Random.roll() < ODDS) {
      const amount = NumberUtil.round(wealth * TAX.PERCENT, DECIMAL_ROUND_AMOUNT);
      const leader = this.client.users.get(leaderId);

      if (leader) {
        await MessageUtil.notify(leader, `your gang was forced to pay \
${NumberUtil.toUSD(amount)} in taxes.`, 'tax');
      }

      const gangIndex = dbGuild.gangs.findIndex(x => x.name === gangName);
      const update = {
        $inc: {
          [`gangs.${gangIndex}.wealth`]: -amount
        }
      };

      return this.client.db.guildRepo.updateGuild(dbGuild.guildId, update);
    }
  }
}

module.exports = AutoTax;

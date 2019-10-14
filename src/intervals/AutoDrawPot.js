const {
  RESTRICTIONS: { COMMANDS: { POT: { MINIMUM_MEMBERS } } },
  MISCELLANEA: { POT_FEE, TO_PERCENT_AMOUNT }
} = require('../utility/Constants.js');
const StringUtil = require('../utility/StringUtil.js');
const NumberUtil = require('../utility/NumberUtil.js');
const Interval = require('../structures/Interval.js');
const messages = require('../../data/messages.json');
const cooldowns = require('../../data/cooldowns.json');

class AutoDrawPot extends Interval {
  constructor(client) {
    super(client, cooldowns.intervals.autoDrawPot);
  }

  async onTick() {
    const { pots } = this.client.registry.commands.find(x => x.names[0] === 'pot');
    const keys = Object.keys(pots);
    const expired = keys.filter(
      x => pots[x]
        && pots[x].expired
        && pots[x].members.length >= MINIMUM_MEMBERS

    );

    for (let i = 0; i < expired.length; i++) {
      const guildID = expired[i];
      const guild = this.client.guilds.get(guildID);

      if (!guild) {
        continue;
      }

      const pot = pots[guildID];
      const winner = pot.draw();
      const member = guild.members.get(winner.id);
      const rawWon = pot.value;
      const fee = rawWon * POT_FEE;
      const profit = rawWon - fee;
      const dbGuild = await guild.dbGuild();

      await this.client.db.userRepo.modifyCash(dbGuild, member, profit);

      const channel = guild.channels.get(pot.channel);

      if (channel) {
        await channel.trySendMessage(StringUtil.format(
          messages.intervals.autoDrawPot,
          StringUtil.boldify(`${member.user.username}#${member.user.discriminator}`),
          POT_FEE * TO_PERCENT_AMOUNT,
          NumberUtil.toUSD(process),
          winner.odds
        ));
      }

      pots[guildID] = null;
    }
  }
}

module.exports = AutoDrawPot;

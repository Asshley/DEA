const {
  RESTRICTIONS: { COMMANDS: { POT: { MINIMUM_MEMBERS } } },
  MISCELLANEA: { POT_FEE, TO_PERCENT_AMOUNT },
  COOLDOWNS
} = require('../utility/Constants.js');
const Pot = require('../structures/Pot.js');
const StringUtil = require('../utility/StringUtil.js');
const NumberUtil = require('../utility/NumberUtil.js');
const Interval = require('../structures/Interval.js');

class AutoDrawPot extends Interval {
  constructor(client) {
    super(client, COOLDOWNS.AUTO_DRAW_POT);
  }

  async onTick() {
    const { pots } = this.client.registry.commands.find(x => x.names[0] === 'pot');
    const expired = [...pots.filter(x => x.expired && x.members.length >= MINIMUM_MEMBERS).keys()];

    for (let i = 0; i < expired.length; i++) {
      const guildID = expired[i];
      const guild = this.client.guilds.get(guildID);

      if (!guild) {
        continue;
      }

      const pot = pots.get(guildID);
      const winner = pot.draw();
      const member = guild.member(winner.id);
      const rawWon = Pot.totalCash(pot);
      const fee = rawWon * POT_FEE;
      const profit = rawWon - fee;
      const dbGuild = await guild.dbGuild();

      await this.client.db.userRepo.modifyCash(dbGuild, member, profit);
      pots.delete(guildID);

      const channel = this.client.channels.get(pot.channel);

      if (channel) {
        return channel.tryCreateMessage(`Congratulations ${StringUtil.boldify(member.user.tag)}. \
After a fee of ${POT_FEE * TO_PERCENT_AMOUNT}%, you have automatically won \
${NumberUtil.toUSD(profit)} with ${winner.odds}% chance of winning the pot!`);
      }
    }
  }
}

module.exports = AutoDrawPot;

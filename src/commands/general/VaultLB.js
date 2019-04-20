const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');

class VaultLB extends Command {
  constructor() {
    super({
      names: ['vaultleaderboards', 'vaultlb', 'vaultleaderboard', 'vaults'],
      groupName: 'general',
      description: 'View the most armed gangs.'
    });
  }

  async run(msg) {
    const guilds = await msg.client.db.guildRepo.findMany({ guildId: msg.guild.id });
    const fn = (accumulator, currentValue) => accumulator + currentValue;
    let message = '';

    for (let i = 0; i < guilds.length; i++) {
      const { gangs } = guilds[i];
      const notEmpty = gangs.filter(x => Object.values(x.vault).length > 0);

      notEmpty
        .sort((a, b) => Object.values(b.vault).reduce(fn) - Object.values(a.vault).reduce(fn));

      for (let m = 0; m < notEmpty.length; m++) {
        if (m + 1 > LEADERBOARD_CAP) {
          break;
        }

        const gang = notEmpty[m];

        message += `${m + 1}. ${StringUtil.boldify(gang.name)}: \
${Object.values(gang.vault).reduce(fn)}\n`;
      }
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply('there is nobody on the leaderboards.');
    }

    return msg.channel.createMessage(message, { title: 'The Vault Leaderboards' });
  }
}

module.exports = new VaultLB();

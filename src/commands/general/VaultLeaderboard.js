const { Command } = require('patron.js');
const {
  RESTRICTIONS: { LEADERBOARD_CAP }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class VaultLeaderboard extends Command {
  constructor() {
    super({
      names: ['vaultleaderboard', 'vaultlb', 'vaults'],
      groupName: 'general',
      description: 'View the most armed gangs.'
    });
  }

  async run(msg) {
    const guilds = await msg._client.db.guildRepo.findMany({ guildId: msg.channel.guild.id });
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

        message += StringUtil.format(
          messages.commands.vaultLeaderboard.message,
          m + 1,
          StringUtil.boldify(gang.name),
          Object.values(gang.vault).reduce(fn)
        );
      }
    }

    if (StringUtil.isNullOrWhiteSpace(message)) {
      return msg.createErrorReply(messages.commands.vaultLeaderboard.none);
    }

    return msg.channel.sendMessage(message, { title: 'The Vault Leaderboards' });
  }
}

module.exports = new VaultLeaderboard();

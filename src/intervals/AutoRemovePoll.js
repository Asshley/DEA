const Interval = require('../structures/Interval.js');
const StringUtil = require('../utility/StringUtil.js');
const messages = require('../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');

class AutoRemovePoll extends Interval {
  constructor(client) {
    super(client, cooldowns.intervals.autoRemovePoll);
  }

  async onTick() {
    const guilds = await this.client.db.guildRepo.findMany();

    for (let i = 0; i < guilds.length; i++) {
      if (!guilds[i].polls.length) {
        continue;
      }

      const { polls } = guilds[i];

      for (let j = 0; j < polls.length; j++) {
        const pollLength = polls[j].length;
        const pollCreatedAt = polls[j].createdAt;

        if (Date.now() - pollCreatedAt - pollLength <= 0) {
          continue;
        }

        const guild = this.client.guilds.get(guilds[i].guildId);

        if (!guild) {
          continue;
        }

        await this.client.db.guildRepo.updateGuild(guild.id, { $pull: { polls: polls[j] } });

        const creator = guild.members.get(polls[i].author);

        if (!creator) {
          continue;
        }

        const choices = Object.keys(polls[j].choices)
          .map(x => `\`${x}\` Votes: ${polls[j].choices[x].voters.length},`)
          .join('\n');

        await creator.user.tryDM(StringUtil.format(
          messages.intervals.autoRemovePoll, choices, polls[j].name
        ), { guild });
      }
    }
  }
}

module.exports = AutoRemovePoll;

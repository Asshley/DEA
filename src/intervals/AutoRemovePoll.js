const { COOLDOWNS } = require('../utility/Constants.js');
const Interval = require('../structures/Interval.js');

class AutoRemovePoll extends Interval {
  constructor(client) {
    super(client, COOLDOWNS.AUTO_REMOVE_POLL);
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

        const creator = guild.member(polls[i].author);

        if (!creator) {
          continue;
        }

        const choices = Object.keys(polls[j].choices)
          .map(x => `\`${x}\` Votes: ${polls[j].choices[x].voters.length},`)
          .join('\n');

        await creator.user.tryDM(
          `${choices}Final Poll Results Of ${polls[j].name} Poll.`, { guild }
        );
      }
    }
  }
}

module.exports = AutoRemovePoll;

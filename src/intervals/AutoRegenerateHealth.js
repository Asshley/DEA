const {
  MAX_AMOUNTS: { HEALTH: MAX_HEALTH }
} = require('../utility/Constants.js');
const Interval = require('../structures/Interval.js');
const cooldowns = require('../../../data/cooldowns.json');

class AutoRegenerateHealth extends Interval {
  constructor(client) {
    super(client, cooldowns.intervals.autoRegenerateHealth);
  }

  async onTick() {
    const users = await this.client.db.userRepo.findMany();

    for (let i = 0; i < users.length; i++) {
      const { health } = users[i];
      const guild = this.client.guilds.get(users[i].guildId);

      if (health >= MAX_HEALTH || !guild) {
        continue;
      }

      const regenAmount = (await guild.dbGuild()).regenHealth;
      const amount = health + regenAmount >= MAX_HEALTH ? MAX_HEALTH : health + regenAmount;
      const update = {
        $set: {
          health: amount
        }
      };

      return this.client.db.userRepo.updateUser(users[i].userId, users[i].guildId, update);
    }
  }
}

module.exports = AutoRegenerateHealth;

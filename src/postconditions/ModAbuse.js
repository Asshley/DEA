const { Postcondition } = require('patron.js');
const { MULTI_MUTEX } = require('../utility/Util.js');
const ModerationService = require('../services/ModerationService.js');
const config = require('../../data/config.json');
const MINUTE = 3e5;
const MINUTE_AMOUNT = 5;
const HOUR = 36e5;
const HOUR_AMOUNT = 15;

class ModAbuse extends Postcondition {
  constructor() {
    super({ name: 'modabuse' });
    this.history = {};
  }

  run(msg, result) {
    const run = msg.dbGuild.autoModeration && !config.botOwners.includes(msg.author.id);

    if (run && result.success !== false) {
      const key = `${msg.author.id}-${msg.channel.guild.id}`;

      return MULTI_MUTEX.sync(key, async () => {
        const value = this.history[key];

        if (!value) {
          this.history[key] = [Date.now()];

          return;
        }

        if (Date.now() - value[value.length - 1] >= HOUR) {
          value.length = 0;
        }

        value.push(Date.now());

        const [first] = value;
        const last = value[value.length - 1];

        if ((last - first <= MINUTE && value.length >= MINUTE_AMOUNT)
          || (last - first <= HOUR && value.length >= HOUR_AMOUNT)) {
          await msg._client.db.blacklistRepo.insertBlacklist(msg.author.id);

          const reason = `Using ${value.length} moderation actions within \
${last - first <= MINUTE && value.length >= MINUTE_AMOUNT ? '5 minutes.' : 'an hour.'}`;

          await ModerationService.tryModLog({
            guild: msg.channel.guild,
            action: 'Auto Blacklist',
            color: config.colors.ban,
            reason,
            moderator: msg._client.user,
            user: msg.author
          });
          this.history[key] = null;
        }
      });
    }
  }
}

module.exports = new ModAbuse();

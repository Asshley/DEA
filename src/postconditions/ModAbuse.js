const { Postcondition } = require('patron.js');
const { MULTI_MUTEX } = require('../utility/Util.js');
const {
  COLORS: { BAN: BAN_COLOR }
} = require('../utility/Constants.js');
const ModerationService = require('../services/ModerationService.js');
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
    if (msg.dbGuild.autoModeration && result.success !== false) {
      return MULTI_MUTEX.sync(msg.channel.guild.id, async () => {
        const key = `${msg.author.id}-${msg.channel.guild.id}`;
        const value = this.history[key];

        if (!value) {
          this.history[key] = [Date.now()];

          return;
        }

        if (Date.now() - value[0] >= HOUR) {
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
            dbGuild: msg.dbGuild,
            guild: msg.channel.guild,
            action: 'Auto Blacklist',
            color: BAN_COLOR,
            reason,
            moderator: msg._client.user,
            user: msg.author
          });
          delete this.history[key];
        }
      });
    }
  }
}

module.exports = new ModAbuse();

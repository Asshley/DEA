const { Command, Context } = require('patron.js');
const {
  CHANNEL_TYPES,
  AUTHORS,
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');
const TO_MB = 1048576;

class Statistics extends Command {
  constructor() {
    super({
      names: ['statistics', 'stats'],
      groupName: 'system',
      description: 'Statistics about this bot.',
      usableContexts: [Context.DM, Context.Guild]
    });
  }

  async run(msg) {
    const uptime = NumberUtil.msToTime(msg._client.uptime);
    const users = msg._client.guilds.reduce((a, b) => a + b.memberCount, 0);

    await msg.author.DMFields([
      'Authors',
      AUTHORS.join('\n'),
      'Framework',
      'patron.js',
      'Memory',
      `${(process.memoryUsage().rss / TO_MB).toFixed(DECIMAL_ROUND_AMOUNT)} MB`,
      'Servers',
      msg._client.guilds.size,
      'Users',
      users,
      'Uptime',
      `Days: ${uptime.days}\nHours: ${uptime.hours}\nMinutes: ${uptime.minutes}`
    ]);

    if (msg.channel.type !== CHANNEL_TYPES.DM) {
      return msg.createReply(StringUtil.format(
        messages.commands.statistics, msg._client.user.username
      ));
    }
  }
}

module.exports = new Statistics();

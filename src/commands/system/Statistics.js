const { Command, Context } = require('patron.js');
const {
  AUTHORS, MISCELLANEA: { DECIMAL_ROUND_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
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
    const uptime = NumberUtil.msToTime(msg.client.uptime);
    const users = msg.client.guilds.reduce((a, b) => a + b.memberCount, 0);

    await msg.author.DMFields([
      'Authors',
      AUTHORS.join('\n'),
      'Framework',
      'patron.js',
      'Memory',
      `${(process.memoryUsage().rss / TO_MB).toFixed(DECIMAL_ROUND_AMOUNT)} MB`,
      'Servers',
      msg.client.guilds.size,
      'Users',
      users,
      'Uptime',
      `Days: ${uptime.days}\nHours: ${uptime.hours}\nMinutes: ${uptime.minutes}`
    ]);

    if (msg.channel.type !== 'dm') {
      return msg.createReply(`you have been DMed with all ${msg.client.user.username} Statistics!`);
    }
  }
}

module.exports = new Statistics();

const { Command, Context } = require('patron.js');
const {
  MESSAGES: { INFORMATION: INFORMATION_MESSAGE },
  RESTRICTIONS: { LOTTERY },
  COOLDOWNS: { MESSAGE_CASH },
  MISCELLANEA: { CASH_PER_MESSAGE }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');

class Info extends Command {
  constructor() {
    super({
      names: ['info', 'information', 'cashinfo', 'cashhelp'],
      groupName: 'system',
      description: 'All the information about the cash system.',
      usableContexts: [Context.DM, Context.Guild]
    });
  }

  async run(msg) {
    await msg.author.DM(StringUtil.format(
      INFORMATION_MESSAGE,
      msg.client.user.username,
      NumberUtil.msToTime(MESSAGE_CASH).seconds,
      NumberUtil.toUSD(CASH_PER_MESSAGE),
      LOTTERY.MAXIMUM_CASH,
      msg.client.user.username,
      msg.client.user.username
    ));

    if (msg.channel.type !== 'dm') {
      return msg.createReply(`you have been DMed all the information about the \
${msg.client.user.username} Cash System!`);
    }
  }
}

module.exports = new Info();

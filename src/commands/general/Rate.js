const { Command, Argument, ArgumentDefault } = require('patron.js');
const { INVESTMENT_NAMES } = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');
const chatService = require('../../services/ChatService.js');

class Rate extends Command {
  constructor() {
    super({
      names: [
        'rate',
        'cashpermessage',
        'increment',
        'inc',
        'cpm'
      ],
      groupName: 'general',
      description: 'View the rate of a user.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'sugma nuts#6666',
          defaultValue: ArgumentDefault.Member,
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const key = `${args.member.id}-${msg.channel.guild.id}`;
    const info = chatService.messages[key];
    let timeLeft = 0;

    if (info) {
      let cd;

      if (msg.dbUser.investments.includes(INVESTMENT_NAMES.LINE)) {
        cd = cooldowns.miscellanea.reducedMessageCash;
      } else {
        cd = cooldowns.miscellanea.messageCash;
      }

      timeLeft = NumberUtil.msToTime(cd - (Date.now() - info.time)).seconds;
    }

    const dbUser = args.member.id === msg.author.id ? msg.dbUser : await args.member.dbUser();
    const baseCPM = info ? info.cpm : msg._client.config.baseCPM;
    const { cpm, inc } = chatService.constructor
      .getCPM(dbUser, baseCPM, msg._client.config.rateIncrement);

    return msg.channel.sendMessage(StringUtil.format(
      messages.commands.rate,
      NumberUtil.toUSD(info ? info.cpm : msg._client.config.baseCPM),
      inc,
      NumberUtil.toUSD(cpm),
      timeLeft <= 0 ? 'on the next valid message' : ` in ${timeLeft} seconds`
    ), { title: `${args.member.user.username}#${args.member.user.discriminator}'s Rate`});
  }
}

module.exports = new Rate();

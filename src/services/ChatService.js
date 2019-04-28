const {
  RESTRICTIONS: { LOTTERY, MINIMUM_MESSAGE_LENGTH },
  INVESTMENTS,
  INVESTMENT_NAMES,
  ODDS
} = require('../utility/Constants.js');
const Random = require('../utility/Random.js');
const StringUtil = require('../utility/StringUtil.js');
const NumberUtil = require('../utility/NumberUtil.js');
const messages = require('../../data/messages.json');
const cooldowns = require('../../data/cooldowns.json');

class ChatService {
  constructor() {
    this.messages = {};
  }

  async applyCash(msg) {
    const key = `${msg.author.id}-${msg.channel.guild.id}`;
    const lastMessage = this.messages[key];
    const cooldown = msg.dbUser.investments.includes(INVESTMENT_NAMES.LINE) ? cooldowns
      .miscellanea.reducedMessageCash : cooldowns.miscellanea.messageCash;
    const cdOver = !lastMessage || Date.now() - lastMessage.time > cooldown;
    const longEnough = msg.content.length >= MINIMUM_MESSAGE_LENGTH;

    if (cdOver && longEnough) {
      const baseCPM = lastMessage ? lastMessage.cpm : msg._client.config.baseCPM;
      const { cpm, inc } = this.constructor
        .getCPM(msg.dbUser, baseCPM, msg._client.config.rateIncrement);
      let amount = cpm * msg.dbGuild.multiplier;

      this.messages[key] = {
        time: Date.now(),
        cpm,
        inc
      };

      if (ODDS.LOTTERY >= Random.roll()) {
        const winnings = Random.nextFloat(LOTTERY.MINIMUM_CASH, LOTTERY.MAXIMUM_CASH);

        amount += winnings;

        return msg.tryCreateReply(StringUtil.format(
          Random.arrayElement(messages.lottery), NumberUtil.toUSD(winnings)
        ));
      }

      return msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, amount);
    }
  }

  static getCPM(dbUser, cpm, inc) {
    const { investments } = dbUser;
    let newInc = inc;

    if (investments.includes(INVESTMENT_NAMES.POUND)) {
      if (investments.includes(INVESTMENT_NAMES.KILO)) {
        newInc *= INVESTMENTS.KILO.CASH_MULTIPLIER;
      } else {
        newInc *= INVESTMENTS.POUND.CASH_MULTIPLIER;
      }
    }

    return {
      cpm: cpm + newInc,
      inc: newInc
    };
  }
}

module.exports = new ChatService();

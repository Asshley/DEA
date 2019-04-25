const {
  COOLDOWNS: { REDUCED_MESSAGE_CASH, MESSAGE_CASH },
  RESTRICTIONS: { LOTTERY, MINIMUM_MESSAGE_LENGTH },
  MISCELLANEA: { CASH_PER_MESSAGE },
  INVESTMENTS,
  ODDS
} = require('../utility/Constants.js');
const Random = require('../utility/Random.js');
const StringUtil = require('../utility/StringUtil.js');
const NumberUtil = require('../utility/NumberUtil.js');
const messages = require('../../data/messages.json');

class ChatService {
  constructor() {
    this.messages = {};
  }

  async applyCash(msg) {
    const key = `${msg.author.id}-${msg.channel.guild.id}`;
    const lastMessage = this.messages[key];
    const perks = this.getInvestmentPerks(msg.dbUser, msg.dbGuild);
    const cdOver = !lastMessage || Date.now() - lastMessage > perks.cooldown;
    const longEnough = msg.content.length >= MINIMUM_MESSAGE_LENGTH;

    if (cdOver && longEnough) {
      let amount = perks.cashPerMessage;

      this.messages[key] = Date.now();

      if (ODDS.LOTTERY >= Random.roll()) {
        const winnings = Random.nextFloat(LOTTERY.MINIMUM_CASH, LOTTERY.MAXIMUM_CASH);

        amount += winnings;

        return msg.tryCreateReply(StringUtil.format(
          Random.arrayElement(messages.lottery), NumberUtil.toUSD(winnings)
        ));
      }

      setTimeout(() => {
        delete this.messages[key];
      }, perks.cooldown + MESSAGE_CASH);

      return msg._client.db.userRepo.modifyCash(msg.dbGuild, msg.member, amount);
    }
  }

  getInvestmentPerks(dbUser, dbGuild) {
    let cashPerMessage = CASH_PER_MESSAGE;

    if (dbUser.investments.includes('pound')) {
      if (dbUser.investments.includes('kilo')) {
        cashPerMessage *= INVESTMENTS.KILO.CASH_MULTIPLIER;
      } else {
        cashPerMessage *= INVESTMENTS.POUND.CASH_MULTIPLIER;
      }
    }

    cashPerMessage *= dbGuild.multiplier;

    return {
      cooldown: dbUser.investments.includes('line') ? REDUCED_MESSAGE_CASH : MESSAGE_CASH,
      cashPerMessage
    };
  }
}

module.exports = new ChatService();

const {
  COOLDOWNS: { REDUCED_MESSAGE_CASH, MESSAGE_CASH },
  RESTRICTIONS: { LOTTERY, MINIMUM_MESSAGE_LENGTH },
  MESSAGES: { LOTTERY: LOTTERY_MESSAGES },
  MISCELLANEA: { CASH_PER_MESSAGE },
  INVESTMENTS,
  ODDS
} = require('../utility/Constants.js');
const { Collection } = require('discord.js');
const Random = require('../utility/Random.js');
const StringUtil = require('../utility/StringUtil.js');
const NumberUtil = require('../utility/NumberUtil.js');

class ChatService {
  constructor() {
    this.messages = new Collection();
  }

  async applyCash(msg) {
    const lastMessage = this.messages.get(msg.author.id);
    const perks = this.getInvestmentPerks(msg.dbUser, msg.dbGuild);
    const cdOver = !lastMessage || Date.now() - lastMessage > perks.cooldown;
    const longEnough = msg.content.length >= MINIMUM_MESSAGE_LENGTH;

    if (cdOver && longEnough) {
      this.messages.set(msg.author.id, Date.now());

      if (ODDS.LOTTERY >= Random.roll()) {
        const winnings = Random.nextFloat(LOTTERY.MINIMUM_CASH, LOTTERY.MAXIMUM_CASH);

        await msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, winnings);

        const response = StringUtil.format(
          Random.arrayElement(LOTTERY_MESSAGES),
          NumberUtil.toUSD(winnings)
        );

        return msg.tryCreateReply(response);
      }

      return msg.client.db.userRepo.modifyCash(msg.dbGuild, msg.member, perks.cashPerMessage);
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

    const cooldown = dbUser.investments.includes('line') ? REDUCED_MESSAGE_CASH : MESSAGE_CASH;

    return {
      cooldown,
      cashPerMessage
    };
  }
}

module.exports = new ChatService();

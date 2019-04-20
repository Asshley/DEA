const { Command, Argument } = require('patron.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const MAX_NUMBER = 2147e6;

class Trade extends Command {
  constructor() {
    super({
      names: ['trade'],
      groupName: 'items',
      description: 'Trade items with someone.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          preconditions: ['noself'],
          example: '"Blast It Baby#6969"'
        }),
        new Argument({
          name: 'Exchange Amount',
          key: 'amount',
          type: 'int',
          example: '2',
          preconditionOptions: [{ minimum: 1 }],
          preconditions: ['minimum']
        }),
        new Argument({
          name: 'Exchange Item',
          key: 'item',
          type: 'item',
          example: '"bear grylls meat"'
        }),
        new Argument({
          name: 'Wanted Amount',
          key: 'amount2',
          type: 'int',
          example: '2',
          preconditionOptions: [{ minimum: 1 }],
          preconditions: ['minimum']
        }),
        new Argument({
          name: 'Wanted Item',
          key: 'item2',
          type: 'item',
          example: '"bear grylls meat"',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const dbUser = await args.member.dbUser();
    const authorDbUser = msg.dbUser;
    const [givingName] = args.item.names;
    const [wantedName] = args.item2.names;

    if (!dbUser.inventory[wantedName]) {
      return msg.createErrorReply('this user doesn\'t have this item.');
    } else if (dbUser.inventory[wantedName] < args.amount2
      || dbUser.inventory[wantedName] - args.amount2 < 0) {
      return msg.createErrorReply('this user doesn\'t have enough of this item.');
    } else if (!authorDbUser.inventory[givingName]) {
      return msg.createErrorReply('you don\'t have this item.');
    } else if (authorDbUser.inventory[givingName] <= 0
      || authorDbUser.inventory[givingName] < args.amount
      || authorDbUser.inventory[givingName] - args.amount < 0) {
      return msg.createErrorReply('you don\'t have enough of this item.');
    }

    const user = msg.client.users.get(args.member.id);
    const key = Random.nextInt(0, MAX_NUMBER).toString();
    const dm = await user.tryDM(`${StringUtil.boldify(msg.author.tag)} is asking to trade you \
${args.amount} of ${StringUtil.capitialize(givingName)} for ${args.amount2} of \
${StringUtil.capitialize(wantedName)}. Reply with "${key}" within the next 5 minutes to accept \
this trade.`, { guild: msg.guild });

    if (!dm) {
      return msg.createErrorReply(`I am unable to DM ${args.member.user.tag}.`);
    }

    await msg.createReply('the user has been informed of this trade.');

    const res = await this.verify(msg.client.db, msg.member, args, key);

    if (res) {
      await user.tryDM(`You've successfully traded with \
${StringUtil.boldify(msg.author.tag)}.`, { guild: msg.guild });

      return msg.author.tryDM(`You've successfully traded with \
${StringUtil.boldify(user.tag)}.`, { guild: msg.guild });
    }
  }

  async verify(db, giver, args, key) {
    const fn = m => m.author.id === args.member.id && m.content.includes(key);
    const result = await args.member.user.dmChannel.awaitMessages(fn, {
      time: 300000, max: 1
    });

    if (result.size >= 1) {
      const dbReciever = await args.member.dbUser();
      const dbGiver = await giver.dbUser();
      const [givingName] = args.item.names;
      const [wantingName] = args.item2.names;
      const pluralWanting = Util.pluralize(StringUtil.capitialize(wantingName), args.amount2);
      const pluralGiving = Util.pluralize(StringUtil.capitialize(givingName), args.amount);

      if (!dbReciever.inventory[wantingName]) {
        return args.member.tryDM(`You don't have any ${pluralWanting} anymore.`);
      } else if (dbReciever.inventory[wantingName] <= 0
        || dbReciever.inventory[wantingName] < args.amount2
        || dbReciever.inventory[wantingName] - args.amount2 < 0) {
        return args.member.tryDM(`You don't own ${args.amount2} ${pluralWanting} anymore.`);
      } else if (!dbGiver.inventory[givingName]) {
        return args.member.tryDM(`${giver.tag} doesn't have any ${pluralGiving} anymore.`);
      } else if (dbGiver.inventory[givingName] <= 0 || dbGiver.inventory[givingName] < args.amount
        || dbGiver.inventory[givingName] - args.amount < 0) {
        return args.member
          .tryDM(`${giver.tag} doesn't own ${args.amount} ${pluralGiving} anymore.`);
      }

      await db.userRepo.updateUser(giver.id, args.member.guild.id, {
        $inc: {
          [`inventory.${givingName}`]: -args.amount, [`inventory.${wantingName}`]: args.amount2
        }
      });
      await db.userRepo.updateUser(args.member.id, args.member.guild.id, {
        $inc: {
          [`inventory.${wantingName}`]: -args.amount2, [`inventory.${givingName}`]: args.amount
        }
      });

      return true;
    }

    return false;
  }
}

module.exports = new Trade();

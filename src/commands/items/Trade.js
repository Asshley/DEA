const { Command, Argument } = require('patron.js');
const { awaitMessages } = require('../../utility/MessageCollector.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const messages = require('../../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.trade.noItemUser);
    } else if (dbUser.inventory[wantedName] < args.amount2
      || dbUser.inventory[wantedName] - args.amount2 < 0) {
      return msg.createErrorReply(messages.commands.trade.notEnoughUser);
    } else if (!authorDbUser.inventory[givingName]) {
      return msg.createErrorReply(messages.commands.trade.noItem);
    } else if (authorDbUser.inventory[givingName] <= 0
      || authorDbUser.inventory[givingName] < args.amount
      || authorDbUser.inventory[givingName] - args.amount < 0) {
      return msg.createErrorReply(messages.commands.trade.notEnough);
    }

    const user = msg._client.users.get(args.member.id);
    const key = Random.nextInt(0, Number.MAX_SAFE_INTEGER).toString();
    const dm = await user.tryDM(StringUtil.format(
      messages.commands.trade.dm,
      StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`),
      args.amount, StringUtil.capitialize(givingName),
      args.amount2, StringUtil.capitialize(wantedName), key
    ), { guild: msg.channel.guild });

    if (!dm) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.trade.cantDM, StringUtil.boldify(`${user.username}#${user.discriminator}`)
      ));
    }

    await msg.createReply(messages.commands.trade.informed);

    const res = await this.verify(msg._client.db, msg.member, args, key);

    if (res) {
      await user.tryDM(StringUtil.format(
        messages.commands.trade.success,
        StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`)
      ), { guild: msg.channel.guild });

      return msg.author.tryDM(StringUtil.format(
        messages.commands.trade.success,
        StringUtil.boldify(`${user.username}#${user.discriminator}`)
      ), { guild: msg.channel.guild });
    }
  }

  async verify(db, giver, args, key) {
    const fn = m => m.author.id === args.member.id && m.content.includes(key);
    const result = await awaitMessages(await args.member.user.getDMChannel(), {
      time: 300000, max: 1, filter: fn
    });

    if (!result.length) {
      return false;
    }

    const dbReciever = await args.member.dbUser();
    const dbGiver = await giver.dbUser();
    const [givingName] = args.item.names;
    const [wantingName] = args.item2.names;
    const pluralWanting = Util.pluralize(StringUtil.capitialize(wantingName), args.amount2);
    const pluralGiving = Util.pluralize(StringUtil.capitialize(givingName), args.amount);

    if (!dbReciever.inventory[wantingName]) {
      return args.member.tryDM(StringUtil.format(
        messages.commands.trade.duringNoItem, pluralWanting
      ));
    } else if (dbReciever.inventory[wantingName] <= 0
      || dbReciever.inventory[wantingName] < args.amount2
      || dbReciever.inventory[wantingName] - args.amount2 < 0) {
      return args.member.tryDM(StringUtil.format(
        messages.commands.trade.duringNotEnough, args.amount2, pluralWanting
      ));
    } else if (!dbGiver.inventory[givingName]) {
      return args.member.tryDM(StringUtil.format(
        messages.commands.trade.duringNoItemUser,
        `${giver.username}#${giver.discriminator}`, pluralGiving
      ));
    } else if (dbGiver.inventory[givingName] <= 0 || dbGiver.inventory[givingName] < args.amount
      || dbGiver.inventory[givingName] - args.amount < 0) {
      return args.member.tryDM(StringUtil.format(
        messages.commands.trade.duringNotEnoughUser,
        `${giver.username}#${giver.discriminator}`, args.amount, pluralGiving
      ));
    }

    await this.updateDatabase(db, {
      giver, giving: givingName, amount: args.amount
    }, {
      reciever: args.member, wanting: wantingName, amount2: args.amount2
    });

    return true;
  }

  async updateDatabase(db, { giver, giving, amount }, { reciever, wanting, amount2 }) {
    const update = {
      giver: {
        [`inventory.${giving}`]: -amount, [`inventory.${wanting}`]: amount2
      },
      reciever: {
        [`inventory.${wanting}`]: -amount2, [`inventory.${giving}`]: amount
      }
    };

    if (giving === wanting) {
      update.giver[`inventory.${wanting}`] = amount2 - amount;
      update.reciever[`inventory.${giving}`] = amount - amount2;
    }

    await db.userRepo.updateUser(giver.id, giver.guild.id, { $inc: update.giver });

    return db.userRepo.updateUser(reciever.id, reciever.guild.id, { $inc: update.reciever });
  }
}

module.exports = new Trade();

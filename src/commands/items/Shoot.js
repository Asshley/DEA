const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { HEALTH: MAX_HEALTH },
  INVESTMENT_NAMES,
  INVESTMENTS,
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT, GANG: { CASH_FOR_KILL } },
  RESTRICTIONS: { COMMANDS: { GANG: { MINIMUM_AMOUNT } } }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const itemService = require('../../services/ItemService.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const items = require('../../../data/items.json');
const messages = require('../../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');
const SNOWCAP_ODDS = 80;

class Shoot extends Command {
  constructor() {
    super({
      names: ['shoot'],
      groupName: 'items',
      description: 'Shoot a user with specified gun.',
      postconditions: ['reducedcooldown'],
      cooldown: cooldowns.commands.shoot,
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          preconditions: ['noself'],
          example: '"Blast It Baby#6969"'
        }),
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'intervention',
          preconditionOptions: [{ types: ['gun'] }],
          preconditions: ['nottype', 'needitem', 'allied'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const broken = await itemService
      .break(msg._client.db, msg.channel.guild, msg.author, args.item);

    if (broken) {
      return msg.createErrorReply(StringUtil.format(
        Random.arrayElement(messages.commands.shoot.broken), args.item.names[0]
      ));
    }

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $inc: {
        [args.item.bullet]: -1
      }
    });

    return this.shoot(msg, args.member, args.item);
  }

  async shoot(msg, member, item) {
    const roll = Random.roll();
    const dbUser = await member.dbUser();

    if (roll <= item.accuracy) {
      return this.shotSuccess(msg, member, dbUser, item);
    }

    return msg.createReply(StringUtil.format(messages.commands.shoot.failed, item.bullet));
  }

  async shotSuccess(msg, member, dbUser, item) {
    const damage = itemService.reduceDamage(dbUser, item.damage, items);

    if (dbUser.health - damage <= 0) {
      if (dbUser.investments.includes(INVESTMENT_NAMES.SNOWCAP)) {
        const revived = await this.revive(msg, member);

        if (revived) {
          return;
        }
      }

      const earned = await this.loot(msg.member, member, msg);

      await MessageUtil.notify(member, StringUtil.format(
        messages.commands.shoot.killedDM,
        StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`)
      ), 'killed');

      return msg.createReply(StringUtil.format(
        messages.commands.shoot.killed,
        StringUtil.boldify(`${member.user.username}#${member.user.discriminator}`),
        NumberUtil.format(earned)
      ));
    }

    await msg._client.db.userRepo.updateUser(member.id, msg.channel.guild.id, {
      $inc: { health: -damage }
    });
    await MessageUtil.notify(member, StringUtil.format(
      messages.commands.shoot.userDM,
      StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`),
      damage, dbUser.health - damage
    ), 'shoot');

    return msg.createReply(StringUtil.format(
      messages.commands.shoot.reply,
      damage, StringUtil.boldify(`${member.user.username}#${member.user.discriminator}`)
    ));
  }

  async loot(shooter, shotMember, msg) {
    const dbUser = await shotMember.dbUser();
    const { db } = msg._client;

    itemService.takeInventory(shooter.id, dbUser, msg.channel.guild.id, db);
    await db.userRepo.modifyCashExact(msg.dbGuild, shooter, dbUser.bounty + dbUser.cash);

    const amount = await this.takeWealth(msg, await shotMember.dbGang());

    await db.userRepo.updateUser(shotMember.id, shotMember.guild.id, {
      $set: {
        cash: 0,
        bounty: 0,
        health: 100,
        inventory: {}
      }
    });

    return dbUser.bounty + dbUser.cash + amount;
  }

  async revive(msg, member) {
    const update = {
      $pull: { investments: INVESTMENT_NAMES.SNOWCAP },
      $set: { revivable: INVESTMENTS.SNOWCAP.TIME }
    };
    const success = Random.roll() >= SNOWCAP_ODDS;

    if (success) {
      await msg.createReply(StringUtil.format(
        messages.commands.shoot.revived,
        StringUtil.boldify(`${member.user.username}#${member.user.discriminator}`)
      ));
      await member.tryDM(StringUtil.format(
        messages.commands.shoot.revivedDM,
        StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`)
      ), { guild: msg.channel.guild });
      update.$set.health = MAX_HEALTH;
    }

    await msg._client.db.userRepo.updateUser(member.id, msg.channel.guild.id, update);

    return success;
  }

  async takeWealth(msg, gang) {
    let taken = 0;

    if (gang && NumberUtil.value(gang.wealth) > MINIMUM_AMOUNT) {
      taken = NumberUtil.round(gang.wealth * CASH_FOR_KILL, DECIMAL_ROUND_AMOUNT);
      await msg._client.db.userRepo.modifyCashExact(msg.dbGuild, msg.member, taken);

      const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
      const update = {
        $inc: {
          [`gangs.${gangIndex}.wealth`]: taken
        }
      };

      await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);
    }

    return taken;
  }
}

module.exports = new Shoot();

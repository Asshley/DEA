const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { HEALTH: MAX_HEALTH },
  INVESTMENTS,
  INVESTMENT_NAMES,
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

class Stab extends Command {
  constructor() {
    super({
      names: ['stab'],
      groupName: 'items',
      description: 'Stab a user with specified knife.',
      postconditions: ['reducedcooldown'],
      cooldown: cooldowns.commands.stab,
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
          example: 'huntsman knife',
          preconditionOptions: [{ types: ['knife'] }],
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
        Random.arrayElement(messages.commands.stab.broken), args.item.names[0]
      ));
    }

    return this.stab(msg, args.member, args.item, msg._client.db);
  }

  async stab(msg, member, item) {
    const roll = Random.roll();
    const dbUser = await member.dbUser();

    if (roll <= item.accuracy) {
      return this.stabSuccess(msg, member, dbUser, item);
    }

    return msg.createReply(messages.commands.stab.failed);
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

  async stabSuccess(msg, member, dbUser, item) {
    const damage = await itemService.reduceDamage(dbUser, item.damage, items);

    if (dbUser.health - damage <= 0) {
      if (dbUser.investments.includes(INVESTMENT_NAMES.SNOWCAP)) {
        const revived = await this.revive(msg, member);

        if (revived) {
          return;
        }
      }

      const earned = await this.loot(msg.member, member, msg);

      await MessageUtil.notify(member, StringUtil.format(
        messages.commands.stab.killedDM,
        StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`)
      ), 'killed');

      return msg.createReply(StringUtil.format(
        messages.commands.stab.killed,
        StringUtil.boldify(`${member.user.username}#${member.user.discriminator}`),
        NumberUtil.format(earned)
      ));
    }

    await msg._client.db.userRepo.updateUser(member.id, msg.channel.guild.id, {
      $inc: { health: -damage }
    });
    await MessageUtil.notify(member, StringUtil.format(
      messages.commands.stab.userDM,
      StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`),
      damage, dbUser.health - damage
    ), 'stab');

    return msg.createReply(StringUtil.format(
      messages.commands.stab.reply,
      damage, StringUtil.boldify(`${member.user.username}#${member.user.discriminator}`)
    ));
  }

  async revive(msg, member) {
    const update = {
      $pull: { investments: INVESTMENT_NAMES.SNOWCAP },
      $set: { revivable: Date.now() + INVESTMENTS.SNOWCAP.TIME }
    };
    const success = Random.roll() <= SNOWCAP_ODDS;

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

module.exports = new Stab();

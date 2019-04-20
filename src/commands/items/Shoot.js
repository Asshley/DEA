const { Command, Argument } = require('patron.js');
const {
  MESSAGES: { BROKEN_ITEM, REVIVAL },
  MAX_AMOUNTS: { HEALTH: MAX_HEALTH },
  COOLDOWNS: { SHOOT: SHOOT_COOLDOWN },
  INVESTMENTS: { SNOWCAP },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT, GANG: { CASH_FOR_KILL } },
  RESTRICTIONS: { COMMANDS: { GANG: { MINIMUM_AMOUNT } } }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const itemService = require('../../services/ItemService.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const items = require('../../data/items.json');

class Shoot extends Command {
  constructor() {
    super({
      names: ['shoot'],
      groupName: 'items',
      description: 'Shoot a user with specified gun.',
      postconditions: ['reducedcooldown'],
      cooldown: SHOOT_COOLDOWN,
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
          preconditions: ['nottype', 'donthave', 'allied'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const broken = await itemService.break(msg.client.db, msg.guild, msg.author, args.item);

    if (broken) {
      const response = StringUtil.format(
        Random.arrayElement(BROKEN_ITEM), StringUtil.boldify(args.item.names[0])
      );

      return msg.createErrorReply(response);
    }

    return this.shoot(msg, args.member, args.item, msg.client.db);
  }

  async shoot(msg, member, item, db) {
    const roll = Random.roll();
    const dbUser = await member.dbUser();

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, {
      $inc: {
        [item.bullet]: -1
      }
    });

    if (roll <= item.accuracy) {
      const damage = itemService.reduceDamage(dbUser, item.damage, items);

      if (dbUser.health - damage <= 0) {
        if (dbUser.investments.includes('snowcap')) {
          return this.revive(msg, member);
        }

        itemService.takeInv(msg.author.id, dbUser, msg.guild.id, msg.client.db);
        await db.userRepo.modifyCashExact(msg.dbGuild, msg.member, dbUser.bounty);
        await db.userRepo.modifyCashExact(msg.dbGuild, msg.member, dbUser.cash);

        const amount = await this.takeWealth(msg, await member.dbGang());
        const totalEarning = dbUser.bounty + dbUser.cash + amount;

        await db.userRepo.deleteUser(member.id, msg.guild.id);
        await MessageUtil.notify(member, `Unfortunately, you were killed by \
${StringUtil.boldify(msg.author.tag)}. All your data has been reset.`, 'killed');

        return msg.createReply(`woah, you just killed ${StringUtil.boldify(member.user.tag)}. \
You just earned ${NumberUtil.format(totalEarning)} **AND** their inventory, congrats.`);
      }

      await db.userRepo.updateUser(member.id, msg.guild.id, {
        $inc: {
          health: -damage
        }
      });
      await MessageUtil.notify(member, `${StringUtil.boldify(msg.author.tag)} tried to kill you, \
but nigga you *AH, HA, HA, HA, STAYIN' ALIVE*. -${damage} health. Current Health: \
${dbUser.health - damage}`, 'shoot');

      return msg.createReply(`nice shot, you just dealt ${damage} damage to \
${StringUtil.boldify(member.user.tag)}.`);
    }

    return msg.createReply(`the nigga fucking dodged the ${item.bullet}, literally. \
What in the sac of nuts.`);
  }

  async revive(msg, member) {
    await msg.createReply(StringUtil.format(
      REVIVAL.REPLY, StringUtil.boldify(member.user.tag)
    ));
    await member.tryDM(StringUtil.format(REVIVAL.DM, StringUtil.boldify(msg.author.tag)), {
      guild: msg.guild
    });

    const update = {
      $pull: {
        investments: 'snowcap'
      },
      $set: {
        revivable: SNOWCAP.TIME,
        health: MAX_HEALTH
      }
    };

    return msg.client.db.userRepo.updateUser(member.id, msg.guild.id, update);
  }

  async takeWealth(msg, gang) {
    let taken = 0;

    if (gang && NumberUtil.value(gang.wealth) > MINIMUM_AMOUNT) {
      taken = NumberUtil.round(gang.wealth * CASH_FOR_KILL, DECIMAL_ROUND_AMOUNT);
      await msg.client.db.userRepo.modifyCashExact(msg.dbGuild, msg.member, taken);

      const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
      const update = {
        $inc: {
          [`gangs.${gangIndex}.wealth`]: taken
        }
      };

      await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);
    }

    return taken;
  }
}

module.exports = new Shoot();

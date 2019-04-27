const {
  MAX_AMOUNTS: { HEALTH: MAX_HEALTH },
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT },
  ITEM_TYPES
} = require('../utility/Constants.js');
const Random = require('../utility/Random.js');
const NumberUtil = require('../utility/NumberUtil.js');

class ItemService {
  constructor() {
    this.weapons = null;
    this.ammunation = null;
    this.fish = null;
    this.meat = null;
    this.armour = null;
  }

  getOdds(prop) {
    return this[prop] ? this[prop].reduce((a, b) => a + (b.crate_odds || b.acquire_odds), 0) : null;
  }

  getWeapons(items) {
    if (!this.weapons) {
      const types = [ITEM_TYPES.GUN, ITEM_TYPES.KNIFE, ITEM_TYPES.ARMOUR];

      this.weapons = items
        .filter(x => types.includes(x.type) && x.crate_odds)
        .sort((a, b) => a.crate_odds - b.crate_odds);
    }

    return this.weapons;
  }

  getAmmunation(items) {
    if (!this.ammunation) {
      this.ammunation = items
        .filter(x => x.type === ITEM_TYPES.BULLET && x.crate_odds)
        .sort((a, b) => a.crate_odds - b.crate_odds);
    }

    return this.ammunation;
  }

  getFish(items) {
    if (!this.fish) {
      this.fish = items
        .filter(x => x.type === ITEM_TYPES.FISH && x.acquire_odds)
        .sort((a, b) => a.acquire_odds - b.acquire_odds);
    }

    return this.fish;
  }

  getMeat(items) {
    if (!this.meat) {
      this.meat = items
        .filter(x => x.type === ITEM_TYPES.MEAT && x.acquire_odds)
        .sort((a, b) => a.acquire_odds - b.acquire_odds);
    }

    return this.meat;
  }

  getArmour(items) {
    if (!this.armour) {
      this.armour = items.filter(x => x.type === ITEM_TYPES.ARMOUR);
    }

    return this.armour;
  }

  openCrate(crate, items) {
    const roll = Random.roll();
    const weapons = this.getWeapons(items);
    const ammunation = this.getAmmunation(items);
    const weaponOdds = this.getOdds('weapons');
    const ammoOdds = this.getOdds('ammunation');
    const group = roll <= crate.item_odds ? weapons : ammunation;
    const rollItem = Random.nextInt(1, roll <= crate.item_odds ? weaponOdds : ammoOdds);
    let cumulative = 0;

    for (let i = 0; i < group.length; i++) {
      const item = group[i];

      cumulative += item.crate_odds;

      if (rollItem <= cumulative) {
        return item;
      }
    }
  }

  massOpenCrate(quanity, crate, items) {
    const itemsWon = {};

    for (let i = 0; i < quanity; i++) {
      const item = this.openCrate(crate, items);
      const [name] = item.names;

      itemsWon[name] = itemsWon[name] ? itemsWon[name] + 1 : 1;
    }

    return itemsWon;
  }

  fish(weapon, items) {
    const roll = Random.roll();
    const food = this.getFish(items);
    const foodOdds = this.getOdds('fish');
    const rollOdds = Random.nextInt(1, foodOdds);
    let cumulative = 0;

    if (roll <= weapon.accuracy) {
      for (let i = 0; i < food.length; i++) {
        const fish = food[i];

        cumulative += fish.acquire_odds;

        if (rollOdds <= cumulative) {
          return fish;
        }
      }
    }
  }

  hunt(weapon, items) {
    const roll = Random.roll();
    const food = this.getMeat(items);
    const foodOdds = this.getOdds('meat');
    const rollOdds = Random.nextInt(1, foodOdds);
    let cumulative = 0;

    if (roll <= weapon.accuracy) {
      for (let i = 0; i < food.length; i++) {
        const meat = food[i];

        cumulative += meat.acquire_odds;

        if (rollOdds <= cumulative) {
          return meat;
        }
      }
    }
  }

  reduceDamage(dbUser, damage, items) {
    const armours = this.getArmour(items);
    let reduce = damage;

    for (let i = 0; i < armours.length; i++) {
      if (dbUser.inventory[armours[i].names[0]] > 0) {
        reduce *= (MAX_HEALTH - armours[i].damage_reduction) / MAX_HEALTH;
      }
    }

    return NumberUtil.round(reduce);
  }

  takeInventory(killerID, deadUser, guildID, db) {
    const keys = Object.keys(deadUser.inventory);

    if (!keys.length) {
      return;
    }

    const items = {
      $inc: keys.reduce((a, b) => {
        a[`inventory.${b}`] = deadUser.inventory[b];

        return a;
      }, {})
    };

    return db.userRepo.updateUser(killerID, guildID, items);
  }

  async break(db, guild, user, item) {
    if (NumberUtil.round(item.crate_odds / DECIMAL_ROUND_AMOUNT) >= Random.roll()) {
      const [name] = item.names;
      const inv = `inventory.${name}`;

      await db.userRepo.updateUser(user.id, guild.id, { $inc: { [inv]: -1 } });

      return true;
    }

    return false;
  }
}

module.exports = new ItemService();

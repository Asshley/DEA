const { Command } = require('patron.js');
const {
  MAX_AMOUNTS: { VAULT: { UNIQUE_ITEMS, ITEMS: MAX_ITEMS } },
  MESSAGES: { VAULT }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const MessageUtil = require('../../utility/MessageUtil.js');

class DumpVault extends Command {
  constructor() {
    super({
      names: ['dumpvault', 'dump', 'dumpitems'],
      groupName: 'gangs',
      description: 'Dump your inventory into a gangs vault.',
      preconditions: ['ingang']
    });
  }

  async run(msg) {
    const gang = msg.dbGang;
    const inv = Object.keys(msg.dbUser.inventory).filter(x => msg.dbUser.inventory[x] > 0);

    if (!inv.length) {
      return msg.createErrorReply(VAULT.NO_DUMP_ITEMS);
    }

    const vault = Object.keys(gang.vault).filter(x => gang.vault[x] > 0);
    const cappedItems = vault.filter(x => gang.vault[x] >= MAX_ITEMS);

    if (vault.length >= UNIQUE_ITEMS && cappedItems.length >= UNIQUE_ITEMS) {
      return msg.createErrorReply(VAULT.MAXIMUM_AMOUNT);
    }

    const { trimmed, needs, dumped, items } = this.getDumpable(msg, inv, gang, vault);

    if (!trimmed.length && needs.length) {
      const string = Util.list(needs, 'or', StringUtil.capitialize);

      return msg.createErrorReply(
        StringUtil.format(VAULT.NEEDED_ITEMS, needs.length > 1 ? 's' : '', string)
      );
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, { $inc: items.inv });
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $inc: items.vault });

    const leader = msg.guild.members.get(gang.leaderId);

    await MessageUtil.notify(
      leader, StringUtil.format(VAULT.DUMPED_DM, StringUtil.boldify(msg.author.tag), dumped), 'dump'
    );

    return msg.createReply(StringUtil.format(VAULT.DUMPED_REPLY, dumped));
  }

  getDumpable(msg, inv, gang, vault) {
    const has = inv.filter(x => gang.vault[x] && gang.vault[x] < MAX_ITEMS);
    const dumpable = has.concat(inv.filter(x => !gang.vault[x] || gang.vault[x] < MAX_ITEMS));
    const trimmed = [...new Set(dumpable)].slice(0, UNIQUE_ITEMS + has.length - vault.length);
    const needs = vault.filter(x => gang.vault[x] < MAX_ITEMS && !inv.includes(x));
    const items = {
      inv: {},
      vault: {}
    };
    let dumped = '';
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);

    for (let i = 0; i < trimmed.length; i++) {
      const item = trimmed[i];
      const amount = this.getDumpAmount(msg.dbUser.inventory, item, vault);
      const plural = Util.pluralize(StringUtil.capitialize(item), amount);

      dumped += `${amount} ${plural}\n`;
      items.inv[`inventory.${item}`] = -amount;
      items.vault[`gangs.${gangIndex}.vault.${item}`] = amount;
    }

    return {
      dumped,
      needs,
      items,
      trimmed
    };
  }

  getDumpAmount(inv, item, vault) {
    if (vault[item] && vault[item] + inv[item] > MAX_ITEMS) {
      return MAX_ITEMS - vault[item];
    } else if (inv[item] > MAX_ITEMS) {
      return MAX_ITEMS;
    }

    return inv[item];
  }
}

module.exports = new DumpVault();

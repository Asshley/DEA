const { Command } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { POT: { MINIMUM_MEMBERS } } },
  MISCELLANEA: { TO_PERCENT_AMOUNT, POT_FEE }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const Pot = require('../../structures/Pot.js');
const messages = require('../../../data/messages.json');

class DrawWinner extends Command {
  constructor() {
    super({
      names: ['drawwinner', 'draw', 'drawpot', 'pickwinner'],
      groupName: 'general',
      description: 'Draw a winner from the pot.'
    });
  }

  async run(msg) {
    const { pots } = msg._client.registry.commands.find(x => x.names[0] === 'pot');
    const pot = pots[msg.channel.guild.id];

    if (!pot) {
      return msg.createErrorReply(messages.commands.drawWinner.inactive);
    } else if (pot.owner !== msg.author.id) {
      return msg.createErrorReply(messages.commands.drawWinner.notHost);
    } else if (pot.members.length < MINIMUM_MEMBERS) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.drawWinner.minimumMembers, MINIMUM_MEMBERS
      ));
    }

    const winner = pot.draw();
    const member = msg.channel.guild.members.get(winner.id);
    const rawWon = Pot.totalCash(pot);
    const fee = rawWon * POT_FEE;
    const won = rawWon - fee;

    await msg._client.db.userRepo.modifyCash(msg.dbGuild, member, won);
    delete pots[msg.channel.guild.id];

    return msg.channel.sendMessage(StringUtil.format(
      messages.commands.drawWinner.winner,
      StringUtil.boldify(`${member.user.username}#${member.user.discriminator}`),
      POT_FEE * TO_PERCENT_AMOUNT,
      NumberUtil.toUSD(won),
      winner.odds
    ));
  }
}

module.exports = new DrawWinner();

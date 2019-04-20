const { Command } = require('patron.js');
const {
  RESTRICTIONS: { COMMANDS: { POT: { MINIMUM_MEMBERS } } },
  MISCELLANEA: { TO_PERCENT_AMOUNT, POT_FEE }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const Pot = require('../../structures/Pot.js');

class DrawWinner extends Command {
  constructor() {
    super({
      names: ['drawwinner', 'draw', 'drawpot', 'pickwinner'],
      groupName: 'general',
      description: 'Draw a winner from the pot.'
    });
  }

  async run(msg) {
    const { pots } = msg.client.registry.commands.find(x => x.names[0] === 'pot');
    const pot = pots.get(msg.guild.id);

    if (!pot) {
      return msg.createErrorReply('there is no active pot in this server.');
    } else if (pot.owner !== msg.author.id) {
      return msg.createErrorReply('only the creator of the current pot may draw the winner.');
    } else if (pot.members.length < MINIMUM_MEMBERS) {
      return msg.createErrorReply(`there needs to be at least ${MINIMUM_MEMBERS} members \
in order to draw a winner.`);
    }

    const winner = pot.draw();
    const member = msg.guild.member(winner.id);
    const rawWon = Pot.totalCash(pot);
    const fee = rawWon * POT_FEE;
    const profit = rawWon - fee;

    await msg.client.db.userRepo.modifyCash(msg.dbGuild, member, profit);
    pots.delete(msg.guild.id);

    return msg.channel.createMessage(`Congratulations ${StringUtil.boldify(member.user.tag)}. \
After a fee of ${POT_FEE * TO_PERCENT_AMOUNT}%, you won ${NumberUtil.toUSD(profit)} with \
${winner.odds}% chance of winning the pot!`);
  }
}

module.exports = new DrawWinner();

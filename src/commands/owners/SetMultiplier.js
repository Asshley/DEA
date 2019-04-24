const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class SetMultiplier extends Command {
  constructor() {
    super({
      names: ['setmultiplier', 'setmulti', 'changemulti'],
      groupName: 'owners',
      description: 'Sets the cash multiplier.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'amount',
          example: '50'
        })
      ]
    });
  }

  async run(msg, args) {
    const update = {
      $set: {
        multiplier: args.amount
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.setMultiplier, args.amount
    ));
  }
}

module.exports = new SetMultiplier();

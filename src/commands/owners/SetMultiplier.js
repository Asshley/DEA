const { Command, Argument } = require('patron.js');

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
          type: 'int',
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

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully set the cash multiplier to ${args.amount}.`);
  }
}

module.exports = new SetMultiplier();

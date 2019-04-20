const { Command, Argument } = require('patron.js');

class AutoDisableTrivia extends Command {
  constructor() {
    super({
      names: ['autodisabletrivia'],
      groupName: 'owners',
      description: 'The amount of attempts before disabling auto trivia, 0 to not disable it.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '2',
          preconditionOptions: [{ minimum: 0 }, { maximum: 25 }],
          preconditions: ['minimum', 'maximum']
        })
      ]
    });
  }

  async run(msg, args) {
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $set: { autoDisableTrivia: args.amount }
    });

    return msg.createReply(`you've successfully set trivia to ${args.amount ? '' : 'never'} \
be disabled automatically${args.amount ? ` after ${args.amount} inactive trivia questions` : ''}.`);
  }
}

module.exports = new AutoDisableTrivia();

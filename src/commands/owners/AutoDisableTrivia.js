const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $set: {
        'trivia.autoDisable': args.amount
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.autoDisableTrivia,
      args.amount ? '' : ' never',
      args.amount ? ` after ${args.amount} inactive trivia questions` : ''
    ));
  }
}

module.exports = new AutoDisableTrivia();

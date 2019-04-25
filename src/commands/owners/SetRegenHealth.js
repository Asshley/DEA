const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class SetRegenHealth extends Command {
  constructor() {
    super({
      names: ['setregenhealth', 'regenhealth', 'setregen'],
      groupName: 'owners',
      description: 'Sets the amount of health to be regenerated per hour.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'int',
          example: '5',
          preconditionOptions: [{ minimum: 0 }, { maximum: 100 }],
          preconditions: ['minimum', 'maximum'],
          defaultValue: 5
        })
      ]
    });
  }

  async run(msg, args) {
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $set: {
        regenHealth: args.amount
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.setRegenHealth, args.amount
    ));
  }
}

module.exports = new SetRegenHealth();

const { Command, Argument } = require('patron.js');

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
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $set: { regenHealth: args.amount } });

    return msg.createReply(
      `you've successfully set the server's regen amount to ${args.amount} per hour.`
    );
  }
}

module.exports = new SetRegenHealth();

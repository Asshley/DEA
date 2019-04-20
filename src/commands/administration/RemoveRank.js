const { Command, Argument } = require('patron.js');

class RemoveRank extends Command {
  constructor() {
    super({
      names: ['removerank', 'disablerank', 'deleterank'],
      groupName: 'administration',
      description: 'Remove a rank role.',
      args: [
        new Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Sicario',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const ranks = msg.dbGuild.roles.rank;

    if (!ranks.some(role => role.id === args.role.id)) {
      return msg.createErrorReply('you may not remove a rank role that has not been set.');
    }

    const update = {
      $pull: {
        'roles.rank': {
          id: args.role.id
        }
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    return msg.createReply(`you have successfully removed the rank role ${args.role}.`);
  }
}

module.exports = new RemoveRank();

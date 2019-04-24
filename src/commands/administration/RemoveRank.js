const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.removeRank.notSet);
    }

    const update = {
      $pull: {
        'roles.rank': {
          id: args.role.id
        }
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(
      StringUtil.format(messages.commands.removeRank.successful, args.role.mention)
    );
  }
}

module.exports = new RemoveRank();

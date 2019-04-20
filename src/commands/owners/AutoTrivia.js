const { Command } = require('patron.js');

class AutoTrivia extends Command {
  constructor() {
    super({
      names: ['autotrivia'],
      groupName: 'owners',
      description: 'Toggle auto-trivia.'
    });
  }

  async run(msg) {
    const autoTrivia = !msg.dbGuild.autoTrivia;

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, { $set: { autoTrivia } });

    return msg.createReply(`you've successfully \
${autoTrivia ? 'enabled' : 'disabled'} auto trivia for this server.`);
  }
}

module.exports = new AutoTrivia();

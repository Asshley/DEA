const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class AutoTrivia extends Command {
  constructor() {
    super({
      names: ['autotrivia'],
      groupName: 'owners',
      description: 'Toggle auto-trivia.'
    });
  }

  async run(msg) {
    const auto = !msg.dbGuild.trivia.auto;

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $set: {
        'trivia.auto': auto
      }
    });

    return msg.createReply(StringUtil.format(
      messages.commands.autoTrivia, auto ? 'enabled' : 'disabled'
    ));
  }
}

module.exports = new AutoTrivia();

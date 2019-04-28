const { Command } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class SetAutoModeration extends Command {
  constructor() {
    super({
      names: ['setautomoderation', 'automod', 'modabuse'],
      groupName: 'administration',
      description: 'Toggles the mod abuse feature.'
    });
  }

  async run(msg) {
    const { autoModeration } = msg.dbGuild;

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $set: {
        autoModeration: !autoModeration
      }
    });

    return msg.createReply(
      StringUtil.format(messages.commands.setAutoModeration, !autoModeration)
    );
  }
}

module.exports = new SetAutoModeration();

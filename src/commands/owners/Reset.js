const { Command } = require('patron.js');
const { awaitMessages } = require('../../utility/MessageCollector.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class Reset extends Command {
  constructor() {
    super({
      names: ['reset'],
      groupName: 'owners',
      description: 'Resets all user data in your server.'
    });
  }

  async run(msg) {
    await msg.createReply(StringUtil.format(
      messages.commands.reset.confirm, msg._client.user.username
    ));

    const filter = x => (x.content.toLowerCase() === 'yes' || x.content.toLowerCase() === 'y')
      && x.author.id === msg.author.id;
    const result = await awaitMessages(msg.channel, {
      max: 1, time: 30000, filter
    });

    if (result.length === 1) {
      await msg._client.db.userRepo.deleteUsers(msg.channel.guild.id);
      await msg._client.db.guildRepo.deleteGuild(msg.channel.guild.id);

      return msg.createReply(messages.commands.reset.success);
    }
  }
}

module.exports = new Reset();

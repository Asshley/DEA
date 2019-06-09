const { Command, Argument } = require('patron.js');
const { DEFAULTS: { BLACKLIST } } = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const messages = require('../../../data/messages.json');

class Blacklist extends Command {
  constructor() {
    super({
      names: ['blacklist'],
      groupName: 'botowners',
      description: 'Blacklists a user.',
      args: [
        new Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: '"Jesus Christ#4444"'
        }),
        new Argument({
          name: 'hours',
          key: 'hours',
          type: 'int',
          example: '24',
          defaultValue: BLACKLIST,
          preconditionOptions: [{ minimum: 0 }],
          preconditions: ['minimum']
        })
      ]
    });
  }

  async run(msg, args) {
    if (msg._client.config.botOwners.includes(args.user.id)) {
      return msg.createErrorReply(messages.commands.blacklist.failed);
    } else if (await msg._client.db.blacklistRepo.anyBlacklist(args.user.id)) {
      return msg.createErrorReply(messages.commands.blacklist.alreadyBlacklisted);
    }

    const ms = NumberUtil.hoursToMs(args.hours);

    await msg._client.db.blacklistRepo.insertBlacklist(args.user.id, Date.now() + ms);

    return msg.createReply(StringUtil.format(
      messages.commands.blacklist.success,
      `${args.user.username}#${args.user.discriminator}`,
      args.hours
    ));
  }
}

module.exports = new Blacklist();

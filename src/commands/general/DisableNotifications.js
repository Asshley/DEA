const { Command, Argument } = require('patron.js');
const { NOTIFICATIONS } = require('../../utility/Constants.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');

class DisableNotifications extends Command {
  constructor() {
    super({
      names: ['disablenotification', 'removedms', 'removenotify', 'disabledm'],
      groupName: 'general',
      description: 'Turn off certain DM notifications.',
      args: [
        new Argument({
          name: 'notifications',
          key: 'notifications',
          type: 'string',
          example: 'raid raided deposit',
          preconditionOptions: [{ values: NOTIFICATIONS }],
          preconditions: ['mustbe'],
          infinite: true
        })
      ]
    });
  }

  async run(msg, args) {
    const values = args.notifications.map(x => x.toLowerCase());
    const add = values.filter(x => !msg.dbUser.notifications.includes(x));
    const list = Util.list(add);

    if (!add.length) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.disableNotifications.alreadyDisabled, list
      ));
    }

    await msg._client.db.userRepo.updateUser(msg.author.id, msg.channel.guild.id, {
      $push: {
        notifications: {
          $each: add
        }
      }
    });

    return msg.createReply(StringUtil.format(messages.commands.disableNotifications.success, list));
  }
}

module.exports = new DisableNotifications();

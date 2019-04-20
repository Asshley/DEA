const { Command, Argument } = require('patron.js');
const { NOTIFICATIONS } = require('../../utility/Constants.js');
const Util = require('../../utility/Util.js');

class EnableNotifications extends Command {
  constructor() {
    super({
      names: ['enablenotification', 'adddms', 'notify', 'enabledm'],
      groupName: 'general',
      description: 'Turn on certain DM notifications.',
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
    const remove = values.filter(x => msg.dbUser.notifications.includes(x));

    if (!remove.length) {
      return msg.createErrorReply('there are no new notifications to enable.');
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, {
      $pull: {
        notifications: {
          $in: remove
        }
      }
    });

    const list = Util.list(remove);

    return msg.createReply(`you've successfully enabled the following DM notifications:
${list}`);
  }
}

module.exports = new EnableNotifications();

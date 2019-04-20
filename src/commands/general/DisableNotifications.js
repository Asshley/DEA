const { Command, Argument } = require('patron.js');
const { NOTIFICATIONS } = require('../../utility/Constants.js');
const Util = require('../../utility/Util.js');

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

    if (!add.length) {
      return msg.createErrorReply(`you've already disabled ${Util.list(add)}.`);
    }

    await msg.client.db.userRepo.updateUser(msg.author.id, msg.guild.id, {
      $push: {
        notifications: {
          $each: add
        }
      }
    });

    const list = Util.list(add);

    return msg.createReply(`you've successfully disabled the following DM notifications:
${list}.`);
  }
}

module.exports = new DisableNotifications();

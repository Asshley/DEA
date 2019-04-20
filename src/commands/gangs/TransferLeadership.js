const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');

class TransferLeadership extends Command {
  constructor() {
    super({
      names: ['transferleadership', 'transferleader'],
      groupName: 'gangs',
      description: 'Transfers leadership of your gang to another gang member.',
      preconditions: ['ingang', 'gangowner'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          preconditions: ['noself', 'notbot'],
          example: 'swagdaddy#4200'
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = msg.dbGang;
    const userGang = await args.member.dbGang();

    if (!userGang || userGang.name !== gang.name) {
      return msg.createErrorReply('this user isn\'t in your gang.');
    } else if (args.member.id === gang.leaderId) {
      return msg.createErrorReply('you already own this gang.');
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $pull: {
        [`gangs.${gangIndex}.members`]: {
          id: args.member.id
        }
      },
      $set: {
        [`gangs.${gangIndex}.leaderId`]: args.member.id
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, {
      $push: {
        [`gangs.${gangIndex}.members`]: {
          id: msg.author.id, status: 'member'
        }
      }
    });
    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);
    await MessageUtil.notify(
      args.member, `You've been transfered leadership of gang ${gang.name}.`, 'transferowner'
    );

    return msg.createReply(`you've successfully transfered gang leadership to \
${StringUtil.boldify(args.member.user.tag)}.`);
  }
}

module.exports = new TransferLeadership();

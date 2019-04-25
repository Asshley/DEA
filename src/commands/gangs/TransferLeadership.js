const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const MessageUtil = require('../../utility/MessageUtil.js');
const messages = require('../../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.transferLeadership.notInGang);
    } else if (args.member.id === gang.leaderId) {
      return msg.createErrorReply(messages.commands.transferLeadership.alreadyLeader);
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

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, {
      $push: {
        [`gangs.${gangIndex}.members`]: {
          id: msg.author.id, status: 'member'
        }
      }
    });
    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);
    await MessageUtil.notify(args.member, StringUtil.format(
      messages.commands.transferLeadership.DM, gang.name
    ), 'transferowner');

    return msg.createReply(StringUtil.format(
      messages.commands.transferLeadership.reply,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`)
    ));
  }
}

module.exports = new TransferLeadership();

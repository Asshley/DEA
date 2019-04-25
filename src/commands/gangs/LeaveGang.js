const { Command } = require('patron.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class LeaveGang extends Command {
  constructor() {
    super({
      names: ['leavegang'],
      groupName: 'gangs',
      description: 'Leave\'s gang.',
      preconditions: ['ingang']
    });
  }

  async run(msg) {
    const gang = msg.dbGang;

    if (msg.author.id === gang.leaderId) {
      return msg.createErrorReply(messages.commands.leaveGang.leader);
    }

    const leader = msg.channel.guild.members.get(gang.leaderId);
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $pull: {
        [`gangs.${gangIndex}.members`]: {
          id: msg.author.id
        }
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);
    await this.syncCooldowns(msg.member);
    await leader.tryDM(StringUtil.format(
      messages.commands.leaveGang.DM,
      StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`),
      gang.name
    ), { guild: msg.channel.guild });

    return msg.createReply(StringUtil.format(
      messages.commands.leaveGang.reply,
      gang.name
    ));
  }

  async syncCooldowns(member) {
    const { cooldowns: cds } = member.guild.shard.client.registry.commands
      .find(x => x.names.includes('raid'));

    await Util.MULTI_MUTEX.sync(member.guild.id, async () => {
      const exists = cds.users[`${member.id}-${member.guild.id}`];

      if (exists && exists.resets - Date.now() > 0) {
        cds.users[`${member.id}-${member.guild.id}`] = null;
      }
    });
  }
}

module.exports = new LeaveGang();

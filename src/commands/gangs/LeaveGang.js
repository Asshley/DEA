const { Command } = require('patron.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');

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
      return msg.createErrorReply('you cannot leave the gang because you are the leader. \
Please pass membership to another member of the gang or destroy the gang.');
    }

    const leader = msg.guild.members.get(gang.leaderId);
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $pull: {
        [`gangs.${gangIndex}.members`]: {
          id: msg.author.id
        }
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);
    await this.syncCooldowns(msg.member);
    await leader.tryDM(`${StringUtil.boldify(msg.author.tag)} has left your \
gang ${StringUtil.boldify(gang.name)}.`, { guild: msg.guild });

    return msg.createReply(`you've successfully left ${gang.name}.`);
  }

  async syncCooldowns(member) {
    const { cooldowns: cds } = member.client.registry.commands.find(x => x.names.includes('raid'));

    await Util.MULTI_MUTEX.sync(member.guild.id, async () => {
      const exists = cds.users[`${member.id}-${member.guild.id}`];

      if (exists && exists.resets - Date.now() > 0) {
        cds.users[`${member.id}-${member.guild.id}`] = null;
      }
    });
  }
}

module.exports = new LeaveGang();

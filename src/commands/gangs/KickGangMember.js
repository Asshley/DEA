const { Command, Argument } = require('patron.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');

class KickGangMember extends Command {
  constructor() {
    super({
      names: ['kickgangmember', 'kickmember', 'kickmem'],
      groupName: 'gangs',
      description: 'Kick\'s a member from your gang.',
      preconditions: ['ingang'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          preconditions: ['noself'],
          example: 'swagdaddy#4200'
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = msg.dbGang;

    if (msg.author.id !== gang.leaderId
      && !gang.members.some(v => v.status === 'elder' && v.id === msg.author.id)) {
      return msg.createErrorReply('you cannot kick anyone from your gang since you\'re not \
a leader or elder of it.');
    } else if (args.member.id === gang.leaderId) {
      return msg.createErrorReply('you cannot kick the leader of your gang.');
    }

    const userGang = await args.member.dbGang();

    if (!userGang || userGang.name !== gang.name) {
      return msg.createErrorReply('this user isn\'t in your gang.');
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $pull: {
        [`gangs.${gangIndex}.members`]: {
          id: args.member.id
        }
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);
    await this.syncCooldowns(args.member);
    await args.member.tryDM(`You've been kicked from the gang \
${StringUtil.boldify(gang.name)}.`, { guild: msg.guild });

    return msg.createReply(`you've successfully kicked \
${StringUtil.boldify(args.member.user.tag)} from your gang.`);
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

module.exports = new KickGangMember();

const { Command, Argument } = require('patron.js');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
      return msg.createErrorReply(messages.commands.kickGangMember.needPerms);
    } else if (args.member.id === gang.leaderId) {
      return msg.createErrorReply(messages.commands.kickGangMember.kickLeader);
    }

    const userGang = await args.member.dbGang();

    if (!userGang || userGang.name !== gang.name) {
      return msg.createErrorReply(messages.commands.kickGangMember.notInGang);
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $pull: {
        [`gangs.${gangIndex}.members`]: {
          id: args.member.id
        }
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);
    await this.syncCooldowns(args.member);
    await args.member.tryDM(StringUtil.format(
      messages.commands.kickGangMember.DM, gang.name
    ), { guild: msg.channel.guild });

    return msg.createReply(StringUtil.format(
      messages.commands.kickGangMember.reply,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`)
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

module.exports = new KickGangMember();

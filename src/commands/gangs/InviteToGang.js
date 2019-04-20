const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { GANG: { MEMBERS: MAX_MEMBERS } },
  MESSAGES: { GANG }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const MAX_NUMBER = 2147e6;

class InviteToGang extends Command {
  constructor() {
    super({
      names: ['invitetogang', 'invitegang'],
      groupName: 'gangs',
      description: 'Invites member to join your gang.',
      preconditions: ['ingang'],
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'ash#4930',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const { dbGang: gang } = msg;
    const userGang = await args.member.dbGang();

    if (userGang) {
      return msg.createErrorReply(StringUtil.format(GANG.IN_GANG, 'this user'));
    } else if (gang.members.length >= MAX_MEMBERS) {
      return msg.createErrorReply(GANG.MAXIMUM_MEMBERS);
    } else if (msg.author.id !== gang.leaderId
      && !gang.members.some(v => v.status === 'elder' && v.id === msg.author.id)) {
      return msg.createErrorReply(StringUtil.format(GANG.LACK_PERMS, 'invite'));
    }

    const key = Random.nextInt(0, MAX_NUMBER).toString();

    if (!args.member.dmChannel) {
      await args.member.createDM();
    }

    const dm = await args.member.tryDM(StringUtil.format(
      GANG.INVITED, StringUtil.boldify(msg.author.tag), StringUtil.boldify(gang.name), key
    ), { guild: msg.guild });

    if (!dm) {
      return msg.createErrorReply(StringUtil.format(
        GANG.UNINFORMED_REQUEST, StringUtil.boldify(args.member.user.tag)
      ));
    }

    await msg.createReply(GANG.INFORMED_REQUEST);

    const res = await this.verify(msg, args.member, key);

    if (res) {
      await msg.author.tryDM(StringUtil.format(
        GANG.INVITER_JOINED_DM, StringUtil.boldify(args.member.user.tag)
      ), { guild: msg.guild });

      return args.member.tryDM(StringUtil.format(
        GANG.MEMBER_JOINED_DM, StringUtil.boldify(gang.name)
      ), { guild: msg.guild });
    }

    return msg.author.tryDM(StringUtil.format(
      GANG.NO_RESPONSE_REPLY, StringUtil.boldify(args.member.user.tag)
    ), { guild: msg.guild });
  }

  async verify(msg, member, key) {
    const fn = m => m.author.id === member.id && m.content.includes(key);
    const result = await member.user.dmChannel.awaitMessages(fn, {
      time: 300000, max: 1
    });

    if (result.size >= 1) {
      const gang = await member.dbGang();

      if (gang) {
        await msg.author.tryDM(StringUtil.format(
          GANG.ALREADY_JOINED_GANG_DM, StringUtil.boldify(msg.author.tag)
        ), { guild: member.guild });

        return member.tryDM(StringUtil.format(
          GANG.REQUESTED_JOINED_GANG_DM, StringUtil.boldify(gang.name)
        ), { guild: msg.guild });
      }

      await this.syncCooldowns(member, msg.dbGang);

      const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === msg.dbGang.name);
      const update = {
        $push: {
          [`gangs.${gangIndex}.members`]: {
            id: member.id, status: 'member'
          }
        }
      };

      await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

      return true;
    }

    return false;
  }

  async syncCooldowns(member, gang) {
    const { cooldowns: cds } = member.client.registry.commands.find(x => x.names.includes('raid'));

    await Util.MULTI_MUTEX.sync(member.guild.id, async () => {
      const gangMembers = gang.members.concat(gang.leaderId);
      const cooldowns = gangMembers
        .filter(x => cds.users[`${x.id || x}-${member.guild.id}`]
          && cds.users[`${x.id || x}-${member.guild.id}`].resets - Date.now() > 0)
        .map(x => cds.users[`${x.id || x}-${member.guild.id}`].resets);

      if (!cooldowns.length) {
        return;
      }

      const highest = Math.max(...cooldowns);

      cds.users[`${member.id}-${member.guild.id}`] = {
        resets: highest,
        used: 1
      };
    });
  }
}

module.exports = new InviteToGang();

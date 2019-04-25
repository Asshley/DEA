const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { GANG: { MEMBERS: MAX_MEMBERS } }
} = require('../../utility/Constants.js');
const { awaitMessages } = require('../../utility/MessageCollector.js');
const Random = require('../../utility/Random');
const Util = require('../../utility/Util.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

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
      return msg.createErrorReply(StringUtil.format(
        messages.commands.inviteToGang.inGang, 'this user'
      ));
    } else if (gang.members.length >= MAX_MEMBERS) {
      return msg.createErrorReply(messages.commands.inviteToGang.maxMembers);
    } else if (msg.author.id !== gang.leaderId
      && !gang.members.some(v => v.status === 'elder' && v.id === msg.author.id)) {
      return msg.createErrorReply(messages.commands.inviteToGang.needPerms);
    }

    const key = Random.nextInt(0, Number.MAX_SAFE_INTEGER).toString();
    const dm = await this.DM(msg, args.member, key);

    if (!dm) {
      return;
    }

    const res = await this.verify(msg, args.member, key);

    if (res) {
      await msg.author.tryDM(StringUtil.format(
        messages.commands.inviteToGang.successfulDM,
        StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`)
      ), { guild: msg.channel.guild });

      return args.member.tryDM(StringUtil.format(
        messages.commands.inviteToGang.successfulMemberDM, gang.name
      ), { guild: msg.channel.guild });
    }

    return msg.author.tryDM(StringUtil.format(
      messages.commands.inviteToGang.failure,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`)
    ), { guild: msg.channel.guild });
  }

  async DM(msg, member, key) {
    const dm = await member.tryDM(StringUtil.format(
      messages.commands.inviteToGang.invited,
      StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`),
      msg.dbGang.name,
      key
    ), { guild: msg.channel.guild });

    if (!dm) {
      await msg.createErrorReply(StringUtil.format(
        messages.commands.inviteToGang.cantDM,
        StringUtil.boldify(`${member.user.username}#${member.user.discriminator}`)
      ));

      return false;
    }

    await msg.createReply(messages.commands.inviteToGang.DM);

    return true;
  }

  async verify(msg, member, key) {
    const fn = m => m.author.id === member.id && m.content.includes(key);
    const result = await awaitMessages(await member.user.getDMChannel(), {
      time: 300000, max: 1, filter: fn
    });

    if (result.length >= 1) {
      const gang = await member.dbGang();

      if (gang) {
        await msg.author.tryDM(StringUtil.format(
          messages.commands.inviteToGang.joinedGang,
          StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`)
        ), { guild: member.guild });

        return member.tryDM(StringUtil.format(
          messages.commands.inviteToGang.joinedGangDM, gang.name
        ), { guild: msg.channel.guild });
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

      await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

      return true;
    }

    return false;
  }

  async syncCooldowns(member, gang) {
    const { cooldowns: cds } = member.guild.shard.client.registry.commands
      .find(x => x.names.includes('raid'));

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

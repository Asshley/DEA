const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { GANG: { MEMBERS: MAX_MEMBERS } }
} = require('../../utility/Constants.js');
const { awaitMessages } = require('../../utility/MessageCollector.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const messages = require('../../../data/messages.json');

class JoinGang extends Command {
  constructor() {
    super({
      names: ['joingang'],
      groupName: 'gangs',
      description: 'Asks leader to join his gang.',
      preconditions: ['notingang'],
      args: [
        new Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'Cloud9Swags',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    if (args.gang.members.length >= MAX_MEMBERS) {
      return msg.createErrorReply(messages.commands.joinGang.maxMembers);
    }

    const leader = msg.channel.guild.members.get(args.gang.leaderId);
    
    if (!leader) {
      return msg.createErrorReply('The leader of this gang has left the server.');
    }

    const key = Random.nextInt(0, Number.MAX_SAFE_INTEGER).toString();
    const dm = await leader.tryDM(StringUtil.format(
      messages.commands.joinGang.invite,
      StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`),
      args.gang.name,
      key
    ), { guild: msg.channel.guild });

    if (!dm) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.joinGang.cantDM,
        StringUtil.boldify(`${leader.user.username}#${leader.user.discriminator}`)
      ));
    }

    await msg.createReply(messages.commands.joinGang.DM);

    const res = await this.verify(msg, leader, key);

    if (res) {
      await leader.tryDM(StringUtil.format(
        messages.commands.joinGang.successfulDM,
        StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`)
      ), { guild: msg.channel.guild });

      return msg.author.tryDM(StringUtil.format(
        messages.commands.joinGang.successfulMemberDM, args.gang.name
      ), { guild: msg.channel.guild });
    }

    return msg.author.tryDM(StringUtil.format(
      messages.commands.joinGang.failure,
      StringUtil.boldify(`${leader.user.username}#${leader.user.discriminator}`)
    ), { guild: msg.channel.guild });
  }

  async verify(msg, leader, key) {
    const fn = m => m.author.id === leader.id && m.content.includes(key);
    const result = await awaitMessages(await leader.user.getDMChannel(), {
      time: 300000, max: 1, filter: fn
    });

    if (result.length >= 1) {
      const gang = await msg.member.dbGang();

      if (gang) {
        await leader.tryDM(StringUtil.format(
          messages.commands.joinGang.joinedGang,
          StringUtil.boldify(`${msg.author.username}#${msg.author.discriminator}`)
        ), { guild: msg.channel.guild });

        return msg.author.tryDM(StringUtil.format(
          messages.commands.joinGang.joinedGangDM, gang.name
        ), { guild: msg.channel.guild });
      }

      const leaderGang = await leader.dbGang();

      await this.syncCooldowns(msg, leaderGang);

      const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === leaderGang.name);
      const update = {
        $push: {
          [`gangs.${gangIndex}.members`]: {
            id: msg.author.id, status: 'member'
          }
        }
      };

      await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

      return true;
    }

    return false;
  }

  async syncCooldowns(msg, gang) {
    const { cooldowns: cds } = msg._client.registry.commands.find(x => x.names.includes('raid'));

    await Util.MULTI_MUTEX.sync(msg.channel.guild.id, async () => {
      const gangMembers = gang.members.concat(gang.leaderId);
      const cooldowns = gangMembers
        .filter(x => cds.users[`${x.id || x}-${msg.channel.guild.id}`]
          && cds.users[`${x.id || x}-${msg.channel.guild.id}`].resets - Date.now() > 0)
        .map(x => cds.users[`${x.id || x}-${msg.channel.guild.id}`].resets);

      if (!cooldowns.length) {
        return;
      }

      const highest = Math.max(...cooldowns);

      cds.users[`${msg.author.id}-${msg.channel.guild.id}`] = {
        resets: highest,
        used: 1
      };
    });
  }
}

module.exports = new JoinGang();

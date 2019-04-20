const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { GANG: { MEMBERS: MAX_MEMBERS } }
} = require('../../utility/Constants.js');
const Random = require('../../utility/Random.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');
const MAX_NUMBER = 2147e6;

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
      return msg.createErrorReply('sorry, this gang is full.');
    }

    const leader = msg.guild.members.get(args.gang.leaderId);

    if (!leader.user.dmChannel) {
      await leader.createDM();
    }

    const key = Random.nextInt(0, MAX_NUMBER).toString();
    const dm = await leader.tryDM(`${StringUtil.boldify(msg.author.tag)} is trying to join your \
gang, reply with "${key}" within the next 5 minutes to accept this.`, { guild: msg.guild });

    if (!dm) {
      return msg.createErrorReply(`I am unable to inform ${StringUtil.boldify(leader.user.tag)} \
of your join request.`);
    }

    await msg.createReply('the leader of this gang has successfully been \
informed of your join request.');

    const res = await this.verify(msg, leader, key);

    if (res) {
      await leader.tryDM(`You've successfully let ${StringUtil.boldify(msg.author.tag)} \
join your gang.`, { guild: msg.guild });

      return msg.author.tryDM(`You've successfully joined the gang \
${StringUtil.boldify(args.gang.name)}.`, { guild: msg.guild });
    }

    return msg.author.tryDM(`${StringUtil.boldify(leader.user.tag)} didn't respond \
to your join request.`, { guild: msg.guild });
  }

  async verify(msg, leader, key) {
    const fn = m => m.author.id === leader.id && m.content.includes(key);
    const result = await leader.user.dmChannel.awaitMessages(fn, {
      time: 300000, max: 1
    });

    if (result.size >= 1) {
      const gang = await msg.member.dbGang();

      if (gang) {
        await leader.tryDM(`${StringUtil.boldify(msg.author.tag)} has \
already joined a gang.`, { guild: msg.guild });

        return msg.author.tryDM(`you're unable to join ${StringUtil.boldify(gang.name)}\
 since you're already in a gang.`, { guild: msg.guild });
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

      await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

      return true;
    }

    return false;
  }

  async syncCooldowns(msg, gang) {
    const { cooldowns: cds } = msg.client.registry.commands.find(x => x.names.includes('raid'));

    await Util.MULTI_MUTEX.sync(msg.guild.id, async () => {
      const gangMembers = gang.members.concat(gang.leaderId);
      const cooldowns = gangMembers
        .filter(x => cds.users[`${x.id || x}-${msg.guild.id}`]
          && cds.users[`${x.id || x}-${msg.guild.id}`].resets - Date.now() > 0)
        .map(x => cds.users[`${x.id || x}-${msg.guild.id}`].resets);

      if (!cooldowns.length) {
        return;
      }

      const highest = Math.max(...cooldowns);

      cds.users[`${msg.author.id}-${msg.guild.id}`] = {
        resets: highest,
        used: 1
      };
    });
  }
}

module.exports = new JoinGang();

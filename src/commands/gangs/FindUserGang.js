const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const messages = require('../../../data/messages.json');

class FindUserGang extends Command {
  constructor() {
    super({
      names: ['findusergang', 'usergang', 'membergang'],
      groupName: 'gangs',
      description: 'Finds a user\'s gang.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'hornydevil#9384',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const gang = args.member.id === msg.member.id ? msg.dbGang : await args.member.dbGang();

    if (!gang) {
      return msg.createErrorReply(StringUtil.format(
        messages.commands.findUserGang,
        args.member.id === msg.member.id ? 'you\'re' : 'this user is'
      ));
    }

    const { _client: client } = msg;
    const { username, discriminator } = client.users.get(gang.leaderId)
      || await client.getRESTUser(gang.leaderId);
    const leader = `${username}#${discriminator}`;
    let members = '';
    let elders = '';

    for (let i = 0; i < gang.members.length; i++) {
      const member = gang.members[i];
      const user = client.users.get(member.id) || await client.getRESTUser(member.id);
      const tag = `${user.username}#${user.discriminator}`;

      if (member.status === 'elder') {
        elders += `${tag}${i === gang.members.length - 1 ? '' : ', '}`;
      } else {
        members += `${tag}${i === gang.members.length - 1 ? '' : ', '}`;
      }
    }

    let reply = `**Gang:** ${gang.name}\n**Leader:** ${leader}`;
    const elderAmount = gang.members.filter(x => x.status === 'elder').length;

    if (elderAmount) {
      reply += `\n**Elders:** ${elders}`;
    }

    if (gang.members.length - elderAmount > 0) {
      reply += `\n**Members:** ${members}`;
    }

    reply += `\n**Wealth:** ${NumberUtil.format(gang.wealth)}`;

    return msg.channel.sendMessage(reply, { footer: { text: `Index: ${gang.index}` } });
  }
}

module.exports = new FindUserGang();

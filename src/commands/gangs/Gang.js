const { Command, Argument } = require('patron.js');
const {
  MESSAGES: { GANG }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class Gang extends Command {
  constructor() {
    super({
      names: ['gang', 'findgang'],
      groupName: 'gangs',
      description: 'Finds a gang.',
      args: [
        new Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'Cloud9Swags',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let { gang } = args;

    if (StringUtil.isNullOrWhiteSpace(gang.name)) {
      gang = msg.dbGang;

      if (!gang) {
        return msg.createErrorReply(StringUtil.format(GANG.NOT_IN_GANG, 'you\'re'));
      }
    }

    const { client } = msg;
    const leader = client.users.get(gang.leaderId).tag;
    let members = '';
    let elders = '';

    for (let i = 0; i < gang.members.length; i++) {
      const member = gang.members[i];

      if (member.status === 'elder') {
        elders += `${client.users.get(member.id).tag}${i === gang.members.length - 1 ? '' : ', '}`;
      } else {
        members += `${client.users.get(member.id).tag}${i === gang.members.length - 1 ? '' : ', '}`;
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

    return msg.channel.createMessage(reply, { footer: { text: `Index: ${gang.index}` } });
  }
}

module.exports = new Gang();

const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class Poll extends Command {
  constructor() {
    super({
      names: ['poll', 'findpoll'],
      groupName: 'polls',
      description: 'Finds a poll.',
      args: [
        new Argument({
          name: 'poll',
          key: 'poll',
          type: 'poll',
          example: '4',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    let choices = '';
    const creator = msg._client.users.get(args.poll.author);
    const {
      days, hours, minutes, seconds
    } = NumberUtil.msToTime(args.poll.length - (Date.now() - args.poll.createdAt));
    const keys = Object.keys(args.poll.choices);

    for (let i = 0; i < keys.length; i++) {
      choices += `**${i + 1}**. ${keys[i]}: ${args.poll.choices[keys[i]].voters.length}`;

      if (keys.length - 1 !== i) {
        choices += ',\n';
      }
    }

    return msg.channel.sendMessage(StringUtil.format(
      messages.commands.poll,
      args.poll.index,
      `${creator.username}#${creator.discriminator}`, creator.id,
      choices,
      days, hours, minutes, seconds,
      args.poll.modsOnly ? 'Yes' : 'No'
    ), { title: args.poll.name });
  }
}

module.exports = new Poll();

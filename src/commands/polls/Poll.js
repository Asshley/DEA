const { Command, Argument } = require('patron.js');
const NumberUtil = require('../../utility/NumberUtil.js');

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
    const creator = msg.client.users.get(args.poll.author);
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

    const string = `**Index:** ${args.poll.index}\n**Creator:** ${creator.tag} (${creator.id})
**Answers:** \n${choices}\n**Ending:** ${days} days, ${hours} hours, ${minutes} minutes, ${seconds}\
 seconds\n**Elder Only:** ${args.poll.eldersOnly ? 'Yes' : 'No'}
**Mod Only:** ${args.poll.modsOnly ? 'Yes' : 'No'}`;

    return msg.channel.createMessage(string, { title: args.poll.name });
  }
}

module.exports = new Poll();

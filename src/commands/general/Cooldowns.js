const { Command, Argument, ArgumentDefault } = require('patron.js');
const {
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT: PAD_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');

class Cooldowns extends Command {
  constructor() {
    super({
      names: ['cooldowns', 'cds', 'cd'],
      groupName: 'general',
      description: 'View all command cooldowns of a member.',
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: 'b1nzy#1337',
          defaultValue: ArgumentDefault.Member,
          remainder: true
        })
      ]
    });
  }

  run(msg, args) {
    const commands = msg.client.registry.commands.filter(command => command.hasCooldown);
    let reply = '';

    for (let i = 0; i < commands.length; i++) {
      const { cooldowns } = commands[i];
      const { users } = cooldowns;
      const cooldown = users[`${args.member.id}-${msg.guild.id}`];

      if (cooldown) {
        const remaining = cooldown.resets - Date.now();

        if (remaining > 0 && cooldown.used >= cooldowns.limit) {
          const { hours, minutes, seconds } = NumberUtil.msToTime(remaining);
          const [commandName] = commands[i].names;

          reply += `${StringUtil.boldify(StringUtil.upperFirstChar(commandName))}: \
${StringUtil.pad(`${hours}`, PAD_AMOUNT)}:${StringUtil.pad(`${minutes}`, PAD_AMOUNT)}:\
${StringUtil.pad(`${seconds}`, PAD_AMOUNT)}\n`;
        }
      }
    }

    if (StringUtil.isNullOrWhiteSpace(reply)) {
      return msg.createReply(`all of ${args.member.id === msg.author.id ? 'your' : `${StringUtil
        .boldify(args.member.user.tag)}'s`} commands are ready for use.`);
    }

    return msg.channel.createMessage(reply, { title: `${args.member.user.tag}'s Cooldowns` });
  }
}

module.exports = new Cooldowns();

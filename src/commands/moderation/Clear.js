const { Command, Argument } = require('patron.js');
const {
  COLORS: { CLEAR: CLEAR_COLOR },
  COOLDOWNS: { CLEAR: CLEAR_COOLDOWN },
  RESTRICTIONS: { COMMANDS: { CLEAR: { MAXIMUM_MESSAGES, MINIMUM_MESSAGES } } }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../data/messages.json');
const DELAY = 3e3;

class Clear extends Command {
  constructor() {
    super({
      names: ['clear', 'prune', 'purge'],
      groupName: 'moderation',
      description: `Clear up to ${MAXIMUM_MESSAGES} messages in any text channel.`,
      postconditions: ['reducedcooldown'],
      cooldown: CLEAR_COOLDOWN,
      botPermissions: ['MANAGE_MESSAGES'],
      args: [
        new Argument({
          name: 'quantity',
          key: 'quantity',
          type: 'float',
          example: '5',
          preconditionOptions: [{ minimum: MINIMUM_MESSAGES }, { maximum: MAXIMUM_MESSAGES }],
          preconditions: ['minimum', 'maximum']
        }),
        new Argument({
          name: 'user',
          key: 'user',
          type: 'user',
          example: '"Ass eater 5000"',
          defaultValue: ''
        }),
        new Argument({
          name: 'reason',
          key: 'reason',
          type: 'string',
          example: 'one of the apples was spamming like an orange.',
          defaultValue: '',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    const filter = args.user ? m => m.author.id === args.user.id : null;
    const deleted = await msg.channel.purge(args.quantity, filter);
    const reply = await msg.createReply(StringUtil.format(
      messages.commands.clear, deleted
    ));

    await ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.channel.guild,
      action: 'Clear',
      color: CLEAR_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: null,
      extraInfoType: 'Quantity',
      extraInfo: `${deleted}\n**Channel:** ${msg.channel.name} (${msg.channel.mention})`
    });

    return reply.delete(DELAY);
  }
}

module.exports = new Clear();

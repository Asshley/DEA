const { Command, Argument } = require('patron.js');
const {
  COLORS: { CLEAR: CLEAR_COLOR },
  COOLDOWNS: { CLEAR: CLEAR_COOLDOWN },
  RESTRICTIONS: { COMMANDS: { CLEAR: { MAXIMUM_MESSAGES, MINIMUM_MESSAGES } } }
} = require('../../utility/Constants.js');
const ModerationService = require('../../services/ModerationService.js');
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
    const messages = await msg.channel.messages.fetch({ limit: args.quantity });

    await msg.channel.bulkDelete(messages);

    const reply = await msg.createReply(`You have successfully deleted ${args.quantity} messages.`);

    ModerationService.tryModLog({
      dbGuild: msg.dbGuild,
      guild: msg.guild,
      action: 'Clear',
      color: CLEAR_COLOR,
      reason: args.reason,
      moderator: msg.author,
      user: null,
      extraInfoType: 'Quantity',
      extraInfo: `${args.quantity}\n**Channel:** ${msg.channel.name} (${msg.channel})`
    });

    return reply.delete(DELAY);
  }
}

module.exports = new Clear();

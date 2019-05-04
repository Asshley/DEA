const { Command, Argument } = require('patron.js');
const {
  MAX_AMOUNTS: { BULLY: MAX_BULLY_LENGTH }
} = require('../../utility/Constants.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');
const cooldowns = require('../../../data/cooldowns.json');

class Bully extends Command {
  constructor() {
    super({
      names: ['bully'],
      groupName: 'crime',
      description: 'Bully any user by changing their nickname.',
      postconditions: ['reducedcooldown'],
      cooldown: cooldowns.commands.bully,
      args: [
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          example: '"Johnny Boy#7052"',
          preconditions: ['noself', 'nomoderator', 'manageable']
        }),
        new Argument({
          name: 'nickname',
          key: 'nickname',
          type: 'string',
          example: 'ass hat',
          preconditionOptions: [{ length: MAX_BULLY_LENGTH }],
          preconditions: ['maximumlength'],
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    await args.member.edit({ nick: args.nickname });

    return msg.createReply(StringUtil.format(
      messages.commands.bully,
      StringUtil.boldify(`${args.member.user.username}#${args.member.user.discriminator}`),
      StringUtil.boldify(args.nickname)
    ));
  }
}

module.exports = new Bully();

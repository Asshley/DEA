const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class ModifyHealth extends Command {
  constructor() {
    super({
      names: ['modifyhealth', 'modhealth'],
      groupName: 'owners',
      description: 'Allows you to modify the health of any member.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'float',
          example: '5'
        }),
        new Argument({
          name: 'member',
          key: 'member',
          type: 'member',
          defaultValue: ArgumentDefault.Member,
          example: 'bigdaddy#4000'
        })
      ]
    });
  }

  async run(msg, args) {
    const update = {
      $set: {
        health: args.amount
      }
    };

    await msg._client.db.userRepo.updateUser(args.member.id, msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.modifyHealth,
      args.member.id === msg.author.id ? 'your' : `${StringUtil
        .boldify(`${args.member.user.username}#${args.member.user.discriminator}`)}'s`,
      args.amount
    ));
  }
}

module.exports = new ModifyHealth();

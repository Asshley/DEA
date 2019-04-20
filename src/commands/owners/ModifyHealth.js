const { Command, Argument, ArgumentDefault } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');

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

    await msg.client.db.userRepo.updateUser(args.member.id, msg.guild.id, update);

    return msg.createReply(`you have successfully modifed \
${args.member.id === msg.author.id ? 'your' : `${StringUtil.boldify(args.member.user.tag)}'s`} \
health to ${args.amount}.`);
  }
}

module.exports = new ModifyHealth();

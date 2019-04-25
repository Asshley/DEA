const { Command, Argument } = require('patron.js');
const {
  MISCELLANEA: { TO_PERCENT_AMOUNT, DECIMAL_ROUND_AMOUNT: ROUND }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const StringUtil = require('../../utility/StringUtil.js');
const messages = require('../../../data/messages.json');

class ModifyGangWealth extends Command {
  constructor() {
    super({
      names: [
        'modifygangwealth',
        'modifywealth',
        'modwealth',
        'modifygangcash',
        'modgangcash',
        'modgangwealth'
      ],
      groupName: 'owners',
      description: 'Modifies the specified gang\'s wealth.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'amount',
          example: '1000'
        }),
        new Argument({
          name: 'gang',
          key: 'gang',
          type: 'gang',
          example: 'best gang ever',
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
        return msg.createErrorReply(messages.commands.modifyGangWealth.notInGang);
      }
    }

    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $inc: {
        [`gangs.${gangIndex}.wealth`]: NumberUtil.round(args.amount * TO_PERCENT_AMOUNT, ROUND)
      }
    };

    await msg._client.db.guildRepo.updateGuild(msg.channel.guild.id, update);

    return msg.createReply(StringUtil.format(
      messages.commands.modifyGangWealth.success,
      NumberUtil.toUSD(args.amount),
      gang.leaderId === msg.author.id ? 'your gang' : gang.name
    ));
  }
}

module.exports = new ModifyGangWealth();

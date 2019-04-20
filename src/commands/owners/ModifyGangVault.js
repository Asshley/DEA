const { Command, Argument } = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const Util = require('../../utility/Util.js');

class ModifyGangWealth extends Command {
  constructor() {
    super({
      names: [
        'modifygangvault',
        'modifyvault',
        'modvault',
        'modifyganginventory',
        'modganginventory',
        'modganginv',
        'modifyganginv'
      ],
      groupName: 'owners',
      description: 'Modifies the specified gang\'s vault.',
      args: [
        new Argument({
          name: 'amount',
          key: 'amount',
          type: 'amount',
          example: '1000'
        }),
        new Argument({
          name: 'item',
          key: 'item',
          type: 'item',
          example: 'intervention'
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
        return msg.createErrorReply('you are not in a gang.');
      }
    }

    const inventory = `vault.${args.item.names[0]}`;
    const gangIndex = msg.dbGuild.gangs.findIndex(x => x.name === gang.name);
    const update = {
      $inc: {
        [`gangs.${gangIndex}.${inventory}`]: args.amount
      }
    };

    await msg.client.db.guildRepo.updateGuild(msg.guild.id, update);

    const plural = Util.pluralize(args.item.names[0], args.amount);

    return msg.createReply(`you have successfully added ${args.amount} ${plural} to \
${gang.leaderId === msg.author.id ? 'your gang' : gang.name}'s vault.`);
  }
}

module.exports = new ModifyGangWealth();

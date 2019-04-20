const { Command, Argument, Context } = require('patron.js');
const {
  COLORS: { ERROR: ERROR_COLOR }
} = require('../../utility/Constants.js');
const util = require('util');

class Eval extends Command {
  constructor() {
    super({
      names: ['eval'],
      groupName: 'botowners',
      description: 'Evalute JavaScript code.',
      usableContexts: [Context.DM, Context.Guild],
      args: [
        new Argument({
          name: 'code',
          key: 'code',
          type: 'string',
          example: 'client.token',
          remainder: true
        })
      ]
    });
  }

  async run(msg, args) {
    try {
      /* eslint-disable no-unused-vars */
      const { client, client: { db }, guild, channel, author, member } = msg;
      const message = msg;
      /* eslint-enable no-unused-vars */
      let result = eval(args.code);

      if (result instanceof Promise) {
        result = await result;
      }

      if (typeof result !== 'string') {
        result = util.inspect(result, { depth: 0 });
      }

      result = result.replace(msg.client.token, ' ');

      return msg.channel.createFieldsMessage(
        ['Eval', `\`\`\`js\n${args.code}\`\`\``, 'Returns', `\`\`\`js\n${result}\`\`\``],
        false
      );
    } catch (err) {
      return msg.channel.createFieldsMessage(
        ['Eval', `\`\`\`js\n${args.code}\`\`\``, 'Error', `\`\`\`js\n${err}\`\`\``],
        false,
        ERROR_COLOR
      );
    }
  }
}

module.exports = new Eval();

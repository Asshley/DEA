const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class UserHasAmount extends ArgumentPrecondition {
  constructor() {
    super({ name: 'userhasamount' });
  }

  async run(command, msg, argument, args, value) {
    if (msg.dbUser.inventory[args.item.names[0]] < value) {
      return PreconditionResult.fromError(command, `you don't have ${value} of this item.`);
    }

    return PreconditionResult.fromSuccess();
  }
}

module.exports = new UserHasAmount();

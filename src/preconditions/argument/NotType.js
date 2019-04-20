const { ArgumentPrecondition, PreconditionResult } = require('patron.js');

class NotType extends ArgumentPrecondition {
  constructor() {
    super({ name: 'nottype' });
  }

  async run(command, msg, argument, args, value, options) {
    const { dbUser } = msg;

    if (options.types.includes(value.type)) {
      if (value.type === 'gun') {
        if (!dbUser.inventory[value.bullet] || dbUser.inventory[value.bullet] <= 0) {
          return PreconditionResult.fromError(
            command,
            `you have no ${value.bullet}s to shoot with.`
          );
        }
      }

      return PreconditionResult.fromSuccess();
    }

    return PreconditionResult.fromError(command, 'this is not a correct item.');
  }
}

module.exports = new NotType();

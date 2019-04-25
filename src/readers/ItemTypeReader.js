const { TypeReader, TypeReaderResult } = require('patron.js');
const items = require('../../data/items.json');

class ItemTypeReader extends TypeReader {
  constructor() {
    super({ type: 'item' });
  }

  async read(command, message, argument, args, input) {
    const item = items.find(x => x.names.includes(input.toLowerCase()));

    if (item) {
      return TypeReaderResult.fromSuccess(item);
    }

    return TypeReaderResult.fromError(command, 'this item doesn\'t exist.');
  }
}

module.exports = new ItemTypeReader();

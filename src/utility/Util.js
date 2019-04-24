const { MultiMutex, Mutex } = require('patron.js');

class Util {
  static pluralize(string, amount) {
    let format = string;

    if (amount > 1) {
      if (string.endsWith('fe')) {
        const lastChars = 2;

        format = `${format.slice(0, format.length - lastChars)}ve`;
      }

      format += 's';
    }

    return format;
  }

  static delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  static list(array, ending = 'and', fn = null) {
    if (array.length === 1) {
      return array[0];
    }

    let string = '';
    const secondToLast = 2;

    for (let i = 0; i < array.length; i++) {
      string += fn ? fn(array[i], i) : array[i];

      if (array.length - secondToLast === i) {
        string += `, ${ending} `;
      } else if (array.length - 1 !== i) {
        string += ', ';
      }
    }

    return string;
  }
}
Util.MULTI_MUTEX = new MultiMutex();
Util.MUTEX = new Mutex();

module.exports = Util;

const { MultiMutex, Mutex } = require('patron.js');
const {
  REGEXES: { CAMEL_CASE }
} = require('../utility/Constants.js');

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

  static toCamelCase(input) {
    const s = input
      .match(CAMEL_CASE)
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');

    return s.slice(0, 1).toLowerCase() + s.slice(1);
  }
}
Util.MULTI_MUTEX = new MultiMutex();
Util.MUTEX = new Mutex();

module.exports = Util;

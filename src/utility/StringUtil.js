const { REGEXES } = require('./Constants.js');

class StringUtil {
  static isNullOrWhiteSpace(input) {
    return typeof input !== 'string' || !input.trim().length;
  }

  static boldify(str) {
    return `**${str.replace(REGEXES.MARKDOWN, '')}**`;
  }

  static upperFirstChar(str, forceLower = false) {
    return str.charAt(0).toUpperCase() + (forceLower ? str.slice(1).toLowerCase() : str.slice(1));
  }

  static format(str, ...args) {
    return str.replace(REGEXES.FORMAT, (_, x) => args[x]);
  }

  static capitialize(str) {
    return str.replace('_', ' ').replace(REGEXES.CAPITALIZE, StringUtil.upperFirstChar);
  }

  static pad(string, size, char = '0') {
    return string.padStart(size, char);
  }
}

module.exports = StringUtil;

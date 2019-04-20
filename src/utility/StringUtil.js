const { Util: { escapeMarkdown } } = require('discord.js');
const { REGEXES } = require('./Constants.js');

class StringUtil {
  static isNullOrWhiteSpace(input) {
    return typeof input !== 'string' || !input.trim().length;
  }

  static boldify(str) {
    return `**${escapeMarkdown(str)}**`;
  }

  static upperFirstChar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static format(str, ...args) {
    return str.replace(REGEXES.FORMAT, (_, x) => args[x]);
  }

  static capitialize(str) {
    return str.replace('_', ' ').replace(REGEXES.CAPITALIZE, StringUtil.upperFirstChar);
  }

  static pad(string, size, char = '0', start = true) {
    return String(string)[start ? 'padStart' : 'padEnd'](size, char);
  }
}

module.exports = StringUtil;

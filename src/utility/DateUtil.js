const StringUtil = require('../utility/StringUtil.js');
const {
  MISCELLANEA: { DECIMAL_ROUND_AMOUNT: PAD_AMOUNT }
} = require('../utility/Constants.js');

class DateUtil {
  static UTCTime(date) {
    return `${StringUtil.pad(`${date.getUTCHours()}`, PAD_AMOUNT)}\
:${StringUtil.pad(`${date.getUTCMinutes()}`, PAD_AMOUNT)}:\
${StringUtil.pad(`${date.getUTCSeconds()}`, PAD_AMOUNT)}`;
  }

  static UTCDate(date) {
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  }
}

module.exports = DateUtil;

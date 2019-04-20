const DateUtil = require('./DateUtil.js');
const util = require('util');

class Logger {
  static log(message, level) {
    const newDate = new Date();
    const formattedMessage = `${DateUtil.UTCTime(newDate)} [${level}] ${message}`;

    /* eslint-disable no-console */
    console.log(formattedMessage);
    /* eslint-enable no-console */
  }

  static handleError(err) {
    const options = {
      depth: null
    };

    return this.log(util.inspect(err, options), 'ERROR');
  }
}

module.exports = Logger;

const util = require('util');

class Logger {
  static log(message, level) {
    const newDate = new Date();
    const formattedMessage = `${newDate.toLocaleString()} [${level}] ${message}`;

    /* eslint-disable no-console */
    console.log(formattedMessage);
    /* eslint-enable no-console */
  }

  static handleError(err) {
    return this.log(util.inspect(err, { depth: null }), 'ERROR');
  }
}

module.exports = Logger;

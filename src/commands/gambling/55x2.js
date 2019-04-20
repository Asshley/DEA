const Gambling = require('../../templates/Gambling.js');
const ODDS = 55;

module.exports = new Gambling(
  ['55x2'], 'Roll 55.0 or higher on a 100.00 sided die to win 1X your bet.', ODDS, 1
);

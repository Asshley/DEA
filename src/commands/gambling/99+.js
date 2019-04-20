const Gambling = require('../../templates/Gambling.js');
const ODDS = 99;
const PAYOUT = 90;

module.exports = new Gambling(
  ['99+'], 'Roll 99.00 or higher on a 100.00 sided die to win 90X your bet.', ODDS, PAYOUT
);

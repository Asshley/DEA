const Gambling = require('../../templates/Gambling.js');
const ODDS = 75;
const PAYOUT = 2.6;

module.exports = new Gambling(
  ['75+'], 'Roll 75.00 or higher on a 100.00 sided die to win 3.6X your bet.', ODDS, PAYOUT
);

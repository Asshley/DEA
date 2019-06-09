const { DEFAULTS: { BLACKLIST } } = require('../../utility/Constants.js');

class BlacklistModel {
  constructor(userId, time) {
    this.userId = userId;
    this.time = time || BLACKLIST;
  }
}

module.exports = BlacklistModel;

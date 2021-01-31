class UserModel {
  constructor(userId, guildId) {
    this.userId = userId;
    this.guildId = guildId;
    this.cash = 0;
    this.bounty = 0;
    this.health = 100;
    this.revivable = null;
    this.inventory = {};
    this.investments = [];
    this.notifications = [];
    this.portfolio = {};
    this.watchlist = [];
  }
}

module.exports = UserModel;

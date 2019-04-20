class User {
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
  }
}

module.exports = User;

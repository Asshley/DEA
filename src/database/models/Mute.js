class Mute {
  constructor(userId, guildId, muteLength) {
    this.userId = userId;
    this.guildId = guildId;
    this.muteLength = muteLength;
    this.mutedAt = Date.now();
  }
}

module.exports = Mute;

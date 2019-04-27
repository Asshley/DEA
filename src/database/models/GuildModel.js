class GuildModel {
  constructor(guildId) {
    this.guildId = guildId;
    this.regenHealth = 5;
    this.multiplier = 1;
    this.caseNumber = 1;
    this.polls = [];
    this.gangs = [];
    this.roles = {
      mod: [],
      rank: [],
      muted: null
    };
    this.trivia = {
      questions: {},
      auto: false,
      autoDisable: 5
    };
    this.channels = {
      modLog: null,
      gamble: [],
      ignore: []
    };
  }
}

module.exports = GuildModel;

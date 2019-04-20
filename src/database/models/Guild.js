class Guild {
  constructor(guildId) {
    this.guildId = guildId;
    this.regenHealth = 5;
    this.autoTrivia = false;
    this.autoDisableTrivia = 0;
    this.multiplier = 1;
    this.roles = {
      mod: [],
      rank: [],
      muted: null
    };
    this.channels = {
      modLog: null,
      gamble: [],
      ignore: []
    };
    this.misc = {
      caseNumber: 1
    };
    this.trivia = {};
    this.polls = [];
    this.gangs = [];
  }
}

module.exports = Guild;

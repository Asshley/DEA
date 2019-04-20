const { Structures } = require('discord.js');
const {
  COLORS: { DEFAULTS }
} = require('../utility/Constants.js');
const Random = require('../utility/Random.js');
const StringUtil = require('../utility/StringUtil.js');

Structures.extend('Message', M => {
  class Message extends M {
    constructor(...args) {
      super(...args);
      this.lastCommand = null;
    }

    get dbGang() {
      return this.dbGuild.gangs
        .find(x => x.members.some(v => v.id === this.author.id) || x.leaderId === this.author.id);
    }

    createReply(description, options = {}) {
      return this.channel.createMessage(`${StringUtil
        .boldify(this.author.tag)}, ${description}`, options);
    }

    tryCreateReply(description, options = {}) {
      return this.channel.tryCreateMessage(`${StringUtil
        .boldify(this.author.tag)}, ${description}`, options);
    }

    createErrorReply(description, options = {}) {
      return this.channel.createErrorMessage(`${StringUtil
        .boldify(this.author.tag)}, ${description}`, options);
    }

    tryCreateErrorReply(description, options = {}) {
      return this.channel.tryCreateErrorMessage(`${StringUtil
        .boldify(this.author.tag)}, ${description}`, options);
    }

    sendEmbed(embed, options = {}) {
      embed.setColor(options.color ? options.color : Random.arrayElement(DEFAULTS));

      return this.channel.send({ embed });
    }
  }

  return Message;
});

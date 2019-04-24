const Eris = require('eris');
const StringUtil = require('../utility/StringUtil.js');

Object.defineProperty(Eris.Message.prototype, 'editedCommand', {
  value: false, writable: true
});
Object.defineProperty(Eris.Message.prototype, 'dbGang', {
  get() {
    return this.dbGuild.gangs
      .find(x => x.members.some(v => v.id === this.author.id) || x.leaderId === this.author.id);
  }
});
Eris.Message.prototype.createReply = function(description, options = {}) {
  return this.channel.sendMessage(`${StringUtil
    .boldify(`${this.author.username}#${this.author.discriminator}`)}, ${description}`, options);
};
Eris.Message.prototype.tryCreateReply = function(description, options = {}) {
  return this.channel.trySendMessage(`${StringUtil
    .boldify(`${this.author.username}#${this.author.discriminator}`)}, ${description}`, options);
};
Eris.Message.prototype.createErrorReply = function(description, options = {}) {
  return this.channel.createErrorMessage(`${StringUtil
    .boldify(`${this.author.username}#${this.author.discriminator}`)}, ${description}`, options);
};
Eris.Message.prototype.tryCreateErrorReply = function(description, options = {}) {
  return this.channel.tryCreateErrorMessage(`${StringUtil
    .boldify(`${this.author.username}#${this.author.discriminator}`)}, ${description}`, options);
};

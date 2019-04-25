const Eris = require('eris');
const { colors } = require('../../data/config.json');
const MessageUtil = require('../utility/MessageUtil.js');
const registry = require('../services/registry.js');

class UserBased {
  static applyExtensions(structure) {
    if (structure === Eris.Member) {
      this.applyMemberExtensions(structure);
    }

    const getChannel = x => (structure === Eris.Member ? x.user : x).getDMChannel();

    structure.prototype.DM = async function(description, options = {}) {
      if (options.guild) {
        options.footer = {
          text: options.guild.name, icon: options.guild.iconURL
        };
      }

      return MessageUtil.sendMessage(await getChannel(this), description, options);
    };
    structure.prototype.tryDM = async function(description, options = {}) {
      try {
        await this.DM(description, options);

        return true;
      } catch (_) {
        return false;
      }
    };
    structure.prototype.DMFields = async function(fields, inline = true, color = null) {
      return MessageUtil.sendFieldsMessage(await getChannel(this), fields, inline, color);
    };
    structure.prototype.DMError = function(description, options = {}) {
      options.color = colors.error;

      return this.DM(description, options);
    };
  }

  static applyMemberExtensions(structure) {
    Object.defineProperty(structure.prototype, 'highestRole', {
      get() {
        const msgObject = {
          member: this,
          channel: {
            guild: this.guild
          }
        };

        return registry.libraryHandler.highestRole(msgObject) || { position: 0 };
      }
    });
    structure.prototype.dbGang = async function() {
      const guild = await this.guild.dbGuild();

      return guild.gangs
        .find(x => x.members.some(v => v.id === this.id) || x.leaderId === this.id);
    };
    structure.prototype.dbUser = function() {
      return this.guild.shard.client.db.userRepo.getUser(this.id, this.guild.id);
    };
  }
}
UserBased.applyExtensions(Eris.Member);
UserBased.applyExtensions(Eris.User);

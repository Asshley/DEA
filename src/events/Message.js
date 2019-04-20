const { DiscordAPIError, Constants: { APIErrors } } = require('discord.js');
const { CommandError, Context } = require('patron.js');
const { PREFIX } = require('../utility/Constants.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');
const NumberUtil = require('../utility/NumberUtil.js');
const StringUtil = require('../utility/StringUtil.js');
const chatService = require('../services/ChatService.js');
const handler = require('../singletons/handler.js');
const CONTEXTS = {
  [Context.Guild]: 'server',
  [Context.DM]: 'DMs'
};
const INTERNAL_ERROR = {
  MINIMUM_CODE: 500,
  MAXIMUM_CODE: 600
};

class MessageEvent extends Event {
  async run(msg) {
    if (await this.constructor.shouldProcess(msg)) {
      if (msg.guild) {
        msg.dbGuild = await msg.client.db.guildRepo.getGuild(msg.guild.id);
        msg.dbUser = await msg.client.db.userRepo.getUser(msg.author.id, msg.guild.id);
      }

      const { guild, dbGuild } = msg;
      const giveCash = guild && !dbGuild.channels.ignore.includes(msg.channel.id);

      if (!msg.content.startsWith(PREFIX)) {
        return giveCash ? chatService.applyCash(msg) : null;
      }

      const result = await handler.run(msg, PREFIX.length);

      if (result.success) {
        Logger.log(`Successful command result: ${msg.id} User: ${msg.author.tag} User ID: \
${msg.author.id} Guild: ${msg.guild ? msg.guild.name : 'NA'} Content ${msg.cleanContent}`, 'DEBUG');
      } else {
        this.constructor.handleError(result, msg);
        Logger.log(`Unsuccessful command result: ${msg.id} User: ${msg.author.tag} User ID: \
${msg.author.id} Guild: ${msg.guild ? msg.guild.name : 'NA'} Content ${msg.cleanContent} \
| Reason: ${result.errorReason}`, 'DEBUG');
      }
    }
  }

  static async shouldProcess(msg) {
    const isBlacklisted = await msg.client.db.blacklistRepo.anyBlacklist(msg.author.id);

    if (msg.author.bot || isBlacklisted) {
      return false;
    }

    return true;
  }

  static handleError(result, msg) {
    let message;

    if (result.commandError === CommandError.UnknownCmd) {
      return;
    } else if (result.commandError === CommandError.Cooldown) {
      const { hours, minutes, seconds } = NumberUtil.msToTime(result.remaining);
      const reply = `Hours: ${hours}\nMinutes: ${minutes}\nSeconds: ${seconds}`;
      const options = {
        title: `${StringUtil.upperFirstChar(result.command.names[0])} Cooldown`
      };

      return msg.channel.tryCreateErrorMessage(reply, options);
    } else if (result.commandError === CommandError.Exception) {
      if (result.error instanceof DiscordAPIError) {
        const { error: { code } } = result;

        if (code === 0 || code === APIErrors.MISSING_PERMISSIONS) {
          message = 'I do not have permission to do that.';
        } else if (code === APIErrors.CANNOT_MESSAGE_USER) {
          message = 'I am unable to message you.';
        } else if (code >= INTERNAL_ERROR.MINIMUM_CODE && code < INTERNAL_ERROR.MINIMUM_CODE) {
          message = 'Houston, we have a problem. Discord internal server errors coming in hot.';
        } else {
          message = result.errorReason;
        }
      } else {
        message = result.errorReason;
        Logger.handleError(result.error);
      }
    } else if (result.commandError === CommandError.InvalidContext) {
      message = `this command can't be used in \
${CONTEXTS[result.context] === 'server' ? 'a ' : ''}${CONTEXTS[result.context]}`;
    } else if (result.commandError === CommandError.InvalidArgCount) {
      message = `you are incorrectly using this command.\n**Usage:** \`${PREFIX}\
${result.command.getUsage()}\`\n**Example:** \`${PREFIX}${result.command.getExample()}\``;
    } else {
      message = result.errorReason;
    }

    return msg.tryCreateErrorReply(message);
  }
}

module.exports = MessageEvent;

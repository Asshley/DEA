const { CommandError, Context } = require('patron.js');
const { CLIENT_EVENTS } = require('../utility/Constants.js');
const ERROR_CODES = {
  MINIMUM: 500,
  MAXIMUM: 600,
  CANNOT_MESSAGE_USER: 50007,
  MISSING_PERMISSIONS: 50013
};
const { MessageCollector } = require('../utility/MessageCollector.js');
const Logger = require('../utility/Logger.js');
const Event = require('../structures/Event.js');
const NumberUtil = require('../utility/NumberUtil.js');
const StringUtil = require('../utility/StringUtil.js');
const chatService = require('../services/ChatService.js');
const handler = require('../services/handler.js');
const contexts = {
  [Context.Guild]: 'server',
  [Context.DM]: 'DMs'
};

class MessageCreate extends Event {
  async run(msg) {
    const process = await this.constructor.shouldProcess(msg);

    if (!process) {
      return;
    } else if (msg.channel.guild) {
      msg.dbGuild = await msg._client.db.guildRepo.getGuild(msg.channel.guild.id);
      msg.dbUser = await msg._client.db.userRepo.getUser(msg.author.id, msg.channel.guild.id);
    }

    MessageCollector.collect(msg);

    const { channel: { guild }, dbGuild } = msg;
    const giveCash = guild && !dbGuild.channels.ignore.includes(msg.channel.id);

    if (!msg.content.startsWith(msg._client.config.prefix)) {
      return giveCash ? chatService.applyCash(msg) : null;
    }

    const command = await handler.parseCommand(msg, msg._client.config.prefix.length);

    if (!command.success) {
      return;
    }

    const result = await handler.run(msg, msg._client.config.prefix.length);

    msg.lastCommand = command.commandName;

    if (!result.success) {
      this.constructor.handleError(result, msg);
      Logger.log(`Unsuccessful command result: ${msg.id} User: ${msg.author.username}\
#${msg.author.discriminator} User ID: ${msg.author.id} \
Guild: ${msg.channel.guild ? msg.channel.guild.name : 'NA'} Content: \
${msg.cleanContent} | Reason: ${result.errorReason}`, 'DEBUG');
    }
  }

  static async shouldProcess(msg) {
    const isBlacklisted = await msg._client.db.blacklistRepo.anyBlacklist(msg.author.id);

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
      if (result.error.constructor.name === 'DiscordHTTPError'
        || result.error.constructor.name === 'DiscordRestError') {
        const { error: { code } } = result;

        if (code === 0 || code === ERROR_CODES.MISSING_PERMISSIONS) {
          message = 'I do not have permission to do that.';
        } else if (code === ERROR_CODES.CANNOT_MESSAGE_USER) {
          message = 'I am unable to message you.';
        } else if (code >= ERROR_CODES.MINIMUM && code < ERROR_CODES.MAXIMUM) {
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
${contexts[result.context] === 'server' ? 'a ' : ''}${contexts[result.context]}`;
    } else if (result.commandError === CommandError.InvalidArgCount) {
      message = `you are incorrectly using this command.\n**Usage:** \`${msg._client.config.prefix}\
${result.command.getUsage()}\`\n**Example:** \`${msg._client.config.prefix}
${result.command.getExample()}\``;
    } else {
      message = result.errorReason;
    }

    return msg.tryCreateErrorReply(message);
  }
}
MessageCreate.EVENT_NAME = CLIENT_EVENTS.MESSAGE_CREATE;

module.exports = MessageCreate;

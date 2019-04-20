const {
  MISCELLANEA: { TO_PERCENT_AMOUNT }
} = require('../../utility/Constants.js');
const NumberUtil = require('../../utility/NumberUtil.js');
const BaseRepository = require('./BaseRepository.js');
const UserQuery = require('../queries/UserQuery.js');
const User = require('../models/User.js');
const RankService = require('../../services/RankService.js');

class UserRepository extends BaseRepository {
  anyUser(userId, guildId) {
    return this.any(new UserQuery(userId, guildId));
  }

  async getUser(userId, guildId) {
    const query = new UserQuery(userId, guildId);
    const fetchedUser = await this.findOne(query, guildId);

    return fetchedUser ? fetchedUser : this.findOneAndReplace(query, new User(userId, guildId));
  }

  updateUser(userId, guildId, update) {
    return this.updateOne(new UserQuery(userId, guildId), update);
  }

  findUserAndUpdate(userId, guildId, update) {
    return this.findOneAndUpdate(new UserQuery(userId, guildId), update);
  }

  async upsertUser(userId, guildId, update) {
    if (await this.anyUser(userId, guildId)) {
      return this.updateUser(userId, guildId, update);
    }

    return this.updateOne(new User(userId, guildId), update, true);
  }

  async findUserAndUpsert(userId, guildId, update) {
    if (await this.anyUser(userId, guildId)) {
      return this.findUserAndUpdate(userId, guildId, update);
    }

    return this.findOneAndUpdate(new User(userId, guildId), update, true);
  }

  async modifyCash(dbGuild, member, change) {
    const update = {
      $inc: {
        cash: NumberUtil.round(change * TO_PERCENT_AMOUNT)
      }
    };
    const newDbUser = await this
      .findUserAndUpsert(member.id, dbGuild.guildId, update);

    await RankService.handle(newDbUser, dbGuild, member);

    return newDbUser;
  }

  async modifyCashExact(dbGuild, member, change) {
    const update = {
      $inc: {
        cash: NumberUtil.round(change)
      }
    };
    const newDbUser = await this
      .findUserAndUpsert(member.id, dbGuild.guildId, update);

    await RankService.handle(newDbUser, dbGuild, member);

    return newDbUser;
  }

  async modifyBounty(dbGuild, member, change) {
    const update = {
      $inc: {
        bounty: NumberUtil.round(change * TO_PERCENT_AMOUNT)
      }
    };

    return this.findUserAndUpsert(member.id, dbGuild.guildId, update);
  }

  deleteUser(userId, guildId) {
    return this.deleteOne(new UserQuery(userId, guildId));
  }

  deleteUsers(guildId) {
    return this.deleteMany({ guildId });
  }
}

module.exports = UserRepository;

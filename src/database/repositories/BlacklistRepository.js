const BaseRepository = require('./BaseRepository.js');
const BlacklistQuery = require('../queries/BlacklistQuery.js');
const Blacklist = require('../models/BlacklistModel.js');

class BlacklistRepository extends BaseRepository {
  anyBlacklist(userId) {
    return this.any(new BlacklistQuery(userId));
  }

  findBlacklist(userId) {
    return this.findOne(new BlacklistQuery(userId));
  }

  insertBlacklist(userId, time) {
    return this.insertOne(new Blacklist(userId, time));
  }

  deleteBlacklist(userId) {
    return this.deleteOne(new BlacklistQuery(userId));
  }
}

module.exports = BlacklistRepository;

const BaseRepository = require('./BaseRepository.js');
const BlacklistQuery = require('../queries/BlacklistQuery.js');
const Blacklist = require('../models/Blacklist.js');

class BlacklistRepository extends BaseRepository {
  anyBlacklist(userId) {
    return this.any(new BlacklistQuery(userId));
  }

  findBlacklist(userId) {
    return this.findOne(new BlacklistQuery(userId));
  }

  insertBlacklist(userId) {
    return this.insertOne(new Blacklist(userId));
  }

  deleteBlacklist(userId) {
    return this.deleteOne(new BlacklistQuery(userId));
  }
}

module.exports = BlacklistRepository;

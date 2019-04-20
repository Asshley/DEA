const BaseRepository = require('./BaseRepository.js');
const MuteQuery = require('../queries/MuteQuery.js');
const Mute = require('../models/Mute.js');

class MuteRepository extends BaseRepository {
  anyMute(userId, guildId) {
    return this.any(new MuteQuery(userId, guildId));
  }

  insertMute(userId, guildId, muteLength) {
    return this.insertOne(new Mute(userId, guildId, muteLength));
  }

  findMute(userId, guildId) {
    return this.findOne(new MuteQuery(userId, guildId));
  }

  deleteMute(userId, guildId) {
    return this.deleteOne(new MuteQuery(userId, guildId));
  }
}

module.exports = MuteRepository;

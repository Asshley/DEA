const { MongoClient } = require('mongodb');
const UserRepository = require('./repositories/UserRepository.js');
const GuildRepository = require('./repositories/GuildRepository.js');
const MuteRepository = require('./repositories/MuteRepository.js');
const BlacklistRepository = require('./repositories/BlacklistRepository.js');

class Database {
  async connect(connectionURL) {
    const connection = await MongoClient.connect(connectionURL, { useNewUrlParser: true });
    const db = connection.db(connection.s.options.dbName);

    this.blacklistRepo = new BlacklistRepository(await db.createCollection('blacklists'));
    this.guildRepo = new GuildRepository(await db.createCollection('guilds'));
    this.muteRepo = new MuteRepository(await db.createCollection('mutes'));
    this.userRepo = new UserRepository(await db.createCollection('users'));
    await db.collection('blacklists').createIndex('userId', { unique: true });

    return db.collection('guilds').createIndex('guildId', { unique: true });
  }
}

module.exports = Database;

const Eris = require('eris');

Eris.Guild.prototype.dbGuild = function() {
  return this.shard.client.db.guildRepo.getGuild(this.id);
};
Object.defineProperty(Eris.Guild.prototype, 'mainChannel', {
  get() {
    const text = this.channels.filter(x => x.type === 'text');
    const generalChannel = text.find(x => x.name === 'general' || x.name.includes('main'));

    return generalChannel || text.sort((a, b) => a.createdAt - b.createdAt)[0];
  }
});

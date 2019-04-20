const { Structures } = require('discord.js');

Structures.extend('Guild', G => {
  class Guild extends G {
    dbGuild() {
      return this.client.db.guildRepo.getGuild(this.id);
    }

    get mainChannel() {
      const text = this.channels.filter(x => x.type === 'text');
      const generalChannel = text.find(x => x.name === 'general' || x.name.includes('main'));

      return generalChannel || text.sort((a, b) => a.createdAt - b.createdAt).first();
    }
  }

  return Guild;
});

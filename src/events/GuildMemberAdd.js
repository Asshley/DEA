const MemberService = require('../services/MemberService.js');
const Event = require('../structures/Event.js');

class GuildMemberAddEvent extends Event {
  run(member) {
    return MemberService.join(member);
  }
}

module.exports = GuildMemberAddEvent;

const MemberService = require('../services/MemberService.js');
const Event = require('../structures/Event.js');
const { CLIENT_EVENTS } = require('../utility/Constants.js');

class GuildMemberAdd extends Event {
  run(_, member) {
    return MemberService.join(member);
  }
}
GuildMemberAdd.EVENT_NAME = CLIENT_EVENTS.GUILD_MEMBER_ADD;

module.exports = GuildMemberAdd;

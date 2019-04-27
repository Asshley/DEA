const Event = require('../structures/Event.js');
const { CLIENT_EVENTS } = require('../utility/Constants.js');
const memberService = require('../services/MemberService.js');

class GuildMemberAdd extends Event {
  run(_, member) {
    return memberService.join(member);
  }
}
GuildMemberAdd.EVENT_NAME = CLIENT_EVENTS.GUILD_MEMBER_ADD;

module.exports = GuildMemberAdd;

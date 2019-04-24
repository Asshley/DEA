module.exports.COLORS = {
  BAN: 0xEA0C00,
  CLEAR: 0x001DFF,
  /* eslint-disable no-magic-numbers */
  DEFAULTS: [
    0xFF269A,
    0x00FF00,
    0x00E828,
    0x08F8FF,
    0xF226FF,
    0xFF1C8E,
    0x68FF22,
    0xFFBE11,
    0x2954FF,
    0x9624ED,
    0xA8ED00
  ],
  /* eslint-enable no-magic-numbers */
  CHILL: 0xFF5C11,
  ERROR: 0xFF0000,
  KICK: 0xE8511F,
  MUTE: 0xFF720E,
  UNBAN: 0x13FF19,
  UNMUTE: 0x6DED5E,
  UNCHILL: 0x5BE935
};

module.exports.CHANNEL_TYPES = {
  TEXT: 0,
  DM: 1,
  VOICE: 2,
  GROUP_DM: 3,
  CATEGORY: 4,
  NEWS: 5,
  STORE: 6
};

module.exports.CLIENT_EVENTS = {
  CHANNEL_DELETE: 'channelDelete',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  GUILD_MEMBER_ADD: 'guildMemberAdd',
  GUILD_MEMBER_REMOVE: 'guildMemberRemove',
  GUILD_ROLE_DELETE: 'guildRoleDelete',
  MESSAGE_CREATE: 'messageCreate',
  MESSAGE_UPDATE: 'messageUpdate',
  READY: 'ready',
  SHARD_DISCONNECT: 'shardDisconnect',
  SHARD_READY: 'shardReady',
  SHARD_RESUME: 'shardResume',
  WARN: 'warn'
};

module.exports.BOT_LINK = 'https://discordapp.com/\
oauth2/authorize?client_id=502598213790990336&scope=bot&permissions=8';

module.exports.SERVER_LINK = 'https://discord.gg/nQvecMF';

module.exports.CLIENT_OPTIONS = {
  compress: true,
  restMode: true,
  messageLimit: 10,
  disabledEvents: {
    CHANNEL_UPDATE: true,
    PRESENCE_UPDATE: true,
    TYPING_START: true,
    USER_UPDATE: true,
    VOICE_STATE_UPDATE: true
  }
};

module.exports.NOTIFICATIONS = [
  'Raid',
  'Raided',
  'AddVaultItem',
  'TakeVaultItem',
  'Deposit',
  'Dump',
  'TakeAll',
  'TransferOwner',
  'Withdraw',
  'Shoot',
  'Stab',
  'Killed',
  'Rape'
];

module.exports.PREFIX = '$';

module.exports.ACTIVITY = `${module.exports.PREFIX}help`;

module.exports.AUTHORS = ['Ash'];

module.exports.BOT_OWNERS = [
  '289976550726828042',
  '310859567649128449',
  '226736342745219072',
  '266743271898742785',
  '566694492590047234'
];

module.exports.REGEXES = {
  MARKDOWN: /(\*|~|`|_)+/g,
  CAPITALIZE: /\w\S*/g,
  FORMAT: /{(\d+)}/g,
  GANG_NAME: /[^A-Za-z0-9 ]|[ ]{2,}/,
  NOT_INDEX: /\b.*[a-zA-Z]+.*\b/,
  TRIVIA: /[^A-Za-z0-9?()*/\s']/
};

module.exports.COOLDOWNS = {
  STAB: 144e5,
  SHOOT: 144e5,
  FISH: 9e5,
  HUNT: 9e5,
  OPEN_CRATE: 3e4,
  BULLY: 6e4,
  RAID: 288e5,
  WITHDRAW: 144e5,
  TAKE_FROM_VAULT: 6e4,
  COLLECT: 864e5,
  ROB: 288e5,
  KILL: 864e5,
  CLEAR: 1e3,
  JUMP: 144e5,
  STEAL: 216e5,
  SCAM: 72e5,
  RAPE: 144e5,
  AUTO_UNMUTE: 6e4,
  AUTO_REMOVE_POLL: 18e5,
  AUTO_TRIVIA: 3e5,
  AUTO_REGENERATE: 36e5,
  AUTO_DRAW_POT: 6e4,
  MESSAGE_CASH: 3e4,
  REDUCED_MESSAGE_CASH: 25e3
};

module.exports.INVESTMENTS = {
  LINE: {
    COST: 1e3,
    DESCRIPTION: 'This line of blow is enough to lower the message cooldown from 30 to 25 seconds.'
  },
  POUND: {
    COST: 5e3,
    DESCRIPTION: 'This one pound of coke will double the amount of cash you get per message.',
    CASH_MULTIPLIER: 2
  },
  KILO: {
    COST: 1e4,
    DESCRIPTION: 'A kilo of cocaine is more than enough to quadruple your cash per message.',
    CASH_MULTIPLIER: 4
  },
  CONVOY: {
    COST: 25e3,
    DESCRIPTION: 'A fleet of ships will help distribute your drugs even faster, \
reducing all of your cooldowns by 25%.',
    COOLDOWN_REDUCTION: 0.25
  },
  SNOWCAP: {
    COST: 5e4,
    DESCRIPTION: 'A combination of brick and weed is enough to revive you one time.',
    TIME: 2592e5
  }
};

module.exports.MAX_AMOUNTS = {
  BULLY: 32,
  DOUBLE_WINS: 5,
  GAMBLE_CHANNELS_SHOWN: 5,
  OPEN_ALL: 1e5,
  HEALTH: 100,
  TRIVIA: 500,
  GANG: {
    NAME: 24,
    MEMBERS: 4,
    PER_GUILD: 100
  },
  POLLS: {
    ANSWER: 40,
    ANSWERS: 6,
    POLL_TITLE: 40,
    PER_GUILD: 100
  },
  VAULT: {
    UNIQUE_ITEMS: 10,
    ITEMS: 50
  },
  POT_ODDS: 100,
  POT_VALUE: 1e9
};

module.exports.DEFAULTS = {
  MUTE: 24,
  CHILL: 30
};

module.exports.ODDS = {
  RAID: 80,
  ROB: 60,
  JUMP: 85,
  STEAL: 80,
  SCAM: 90,
  RAPE: 50,
  LOTTERY: 1.25,
  DICE: 50,
  DOUBLE: {
    ODDS: 60,
    GANG_ODDS: 55
  }
};

module.exports.RESTRICTIONS = {
  COMMANDS: {
    BET: {
      MIN_NUMBERS: 2,
      MAX_NUMBERS: 5,
      MIN_VALUE: 2,
      MAX_VALUE: 15
    },
    SUICIDE: {
      CASH_REQUIRED: 1000
    },
    BOUNTY: {
      MINIMUM: 500
    },
    DOUBLE: {
      MINIMUM: 1000
    },
    RAPE: {
      CASH_REQUIRED: 1000,
      AMOUNT: 0.1
    },
    POLLS: {
      TIME_REQUIRED: 1728e5
    },
    GANG: {
      MINIMUM_AMOUNT: 500,
      CREATION_COST: 2500,
      NAME_CHANGE_COST: 500
    },
    ROB: {
      MAXIMUM_CASH: 0.2,
      MINIMUM_CASH: 500
    },
    RAID: {
      MAXIMUM_WEALTH: 0.2
    },
    JUMP: {
      MAXIMUM_CASH: 500,
      MINIMUM_CASH: 250
    },
    SCAM: {
      MAXIMUM_CASH: 250,
      MINIMUM_CASH: 50
    },
    STEAL: {
      MAXIMUM_CASH: 1000,
      MINIMUM_CASH: 500
    },
    CHILL: {
      MAXIMUM_TIME: 3600,
      MINIMUM_TIME: 5
    },
    CLEAR: {
      MAXIMUM_MESSAGES: 500,
      MINIMUM_MESSAGES: 2
    },
    WITHDRAW: {
      MAX: {
        LEADER: 0.5,
        ELDER: 0.2,
        MEMBER: 0.05
      }
    },
    POT: {
      MINIMUM_MEMBERS: 3,
      MAXIMUM_MEMBERS: 10,
      MINIMUM_CASH: 500
    },
    DICE: {
      PAYOUT: 0.8
    }
  },
  TRIVIA: {
    MINIMUM_CASH: 250,
    MAXIMUM_CASH: 1000
  },
  GAMBLING: {
    MINIMUM_BET: 5
  },
  TRANSFER: {
    MINIMUM_CASH: 5
  },
  LOTTERY: {
    MAXIMUM_CASH: 1e4,
    MINIMUM_CASH: 1e3
  },
  LEADERBOARD_CAP: 10,
  MAX_RATELIMIT_MESSAGES: 8,
  MINIMUM_MESSAGE_LENGTH: 7
};

module.exports.MISCELLANEA = {
  GANG: {
    CASH_FOR_KILL: 0.05
  },
  CASH_PER_MESSAGE: 50,
  DECIMAL_ROUND_AMOUNT: 2,
  TO_PERCENT_AMOUNT: 100,
  MAX_TRIVIA_ANSWERS: 3,
  TRANSACTION_FEE: 0.1,
  DAYS_TO_MS: 864e5,
  POT_FEE: 0.05,
  POT_ROUND: 4,
  POT_EXPIRES: 18e5
};

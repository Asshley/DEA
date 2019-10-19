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

module.exports.INVESTMENT_NAMES = {
  LINE: 'line',
  POUND: 'pound',
  KILO: 'kilo',
  CONVOY: 'convoy',
  SNOWCAP: 'snowcap'
};

module.exports.ITEM_TYPES = {
  GUN: 'gun',
  KNIFE: 'knife',
  ARMOUR: 'armour',
  BULLET: 'bullet',
  FISH: 'fish',
  MEAT: 'meat'
};

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

module.exports.REGEXES = {
  MARKDOWN: /(\*|~|`|_)+/g,
  CAPITALIZE: /\w\S*/g,
  FORMAT: /{(\d+)}/g,
  GANG_NAME: /[^A-Za-z0-9 ]|[ ]{2,}/,
  NOT_INDEX: /\b.*[a-zA-Z]+.*\b/,
  TRIVIA: /[^A-Za-z0-9?()*/\s']/
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
reducing all of your cooldowns by 50%.',
    COOLDOWN_REDUCTION: 0.5
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
  CHILL: 30,
  BLACKLIST: 24
};

module.exports.ODDS = {
  RAID: 80,
  ROB: 60,
  JUMP: 85,
  STEAL: 80,
  SCAM: 90,
  RAPE: 50,
  LOTTERY: 0.25,
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
    MAXIMUM_CASH: 5e3,
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
  DECIMAL_ROUND_AMOUNT: 2,
  TO_PERCENT_AMOUNT: 100,
  MAX_TRIVIA_ANSWERS: 3,
  TRANSACTION_FEE: 0.1,
  DAYS_TO_MS: 864e5,
  POT_FEE: 0.05,
  POT_ROUND: 4,
  POT_EXPIRES: 18e5
};

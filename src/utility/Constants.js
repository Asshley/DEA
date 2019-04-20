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

module.exports.LINKS = {
  BOT: 'https://discordapp.com/\
oauth2/authorize?client_id=502598213790990336&scope=bot&permissions=8',
  SERVER: 'https://discord.gg/nQvecMF'
};

module.exports.CLIENT_OPTIONS = {
  fetchAllMembers: true,
  messageCacheMaxSize: 50,
  messageCacheLifetime: 30,
  messageSweepInterval: 600,
  disableEveryone: true,
  disabledEvents: [
    'CHANNEL_PINS_UPDATE',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE',
    'MESSAGE_REACTION_REMOVE_ALL',
    'VOICE_STATE_UPDATE',
    'TYPING_START',
    'VOICE_SERVER_UPDATE',
    'WEBHOOKS_UPDATE'
  ]
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
  'Rape',
  'Tax'
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
  CAPITALIZE: /\w\S*/g,
  FORMAT: /{(\d+)}/g,
  GANG_NAME: /[^A-Za-z0-9 ]|[ ]{2,}/,
  NOT_INDEX: /\b.*[a-zA-Z]+.*\b/,
  TRIVIA: /[^A-Za-z0-9?()*/\s']/,
  CAMEL_CASE: /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
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
  AUTO_TAX: 216e6,
  AUTO_DRAW_POT: 6e4,
  MESSAGE_CASH: 3e4,
  REDUCED_MESSAGE_CASH: 25e3,
  BOT_RATELIMIT: 5e3
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
  TAX: 40,
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
      MINIMUM_CASH: 1e3
    },
    SCAM: {
      MAXIMUM_CASH: 500,
      MINIMUM_CASH: 100
    },
    STEAL: {
      MAXIMUM_CASH: 2500,
      MINIMUM_CASH: 1e3
    },
    CHILL: {
      MAXIMUM_TIME: 3600,
      MINIMUM_TIME: 5
    },
    CLEAR: {
      MAXIMUM_MESSAGES: 100,
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
    MINIMUM_CASH: 500,
    MAXIMUM_CASH: 1500
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
  TAX: {
    MINIMUM_WEALTH: 5e4,
    PERCENT: 0.05
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

module.exports.MESSAGES = {
  JUMP: [
    'you were walking down the street when some homeless guy walked up to you, and then as you \
were giving him 17 cents you see the cracker has {0} worth of drugs, so you jacked them.',
    'after a nice bust at the local strip club, you were walking home when you spotted \
Judge Woody, the cracker who busted you last week, sitting on a bench. \
You decided to jump his fatass, snipe {0} from his wallet, and walk away unharmed.',
    'you jump some dick that got you in court last month, stole his pants and ran. \
Turns out those pants were worth {0}.',
    'you decide to waltz over to Compton to show your strength. \
Fortunately, you found some wallet some guy dropped in a gang fight. The wallet didn\'t have \
jack inside of it, but the it turns out the leather it was made of was worth {0}.'
  ],
  LOTTERY: [
    'CONGRATS MY MAN, you just won {0} in the goddamn lottery!',
    'hot fucking pockets, you just won {0} in the lottery!',
    'well sonny, looks like today is your goddamn lucky day, you just won {0} in the lottery!',
    'Jiminy crickets, you made some bank! You just won {0} from the lottery!',
    'sweet baby jesus you just won {0} in the fucking lottery!',
    'well I\'ll be damned, you just won {0} in the goddamn lottery! '
  ],
  SCAM: [
    'you ripped some grass off the ground, went up to some gangster and sold it to him as weed. \
He gave you {0} for it, and you got out of there before he noticed anything.',
    'you knocked on your neighbor\'s door, asked for some flour to bake a cake, and you sold it \
to your other neighbor as cocaine. You managed to make {0}.',
    'you bought a Monopoly board game, took the fake cash, went to the bank and traded it for USD. \
You walked away with {0}, moved to Cuba, while the US government was chasing you down.',
    'you waited in line for some new Adidas Yeezys, bought 10 pairs and sold them to your idiot \
friends for {0}. Hopefully they won\'t notice your scam.'
  ],
  STEAL: [
    'you and a couple of buddies decide to go bust out the fake nerf guns, stroll over to your \
local {0}, and rob their asses. You got {1} for your share.',
    'while you were shopping at {0}, you thought it was a good idea to nut all over the counter. \
The owner decided to sauce you {1} because he assumed the cum was toxic.'
  ],
  STORES: [
    '7-Eleven',
    'Speedway',
    'Couche-Tard',
    'QuikTrip',
    'Kroger',
    'Circle K',
    'Admiral Petroleum',
    'Big Apple',
    'Bucky\'s Express'
  ],
  BROKEN_ITEM: [
    'you almost fucked up some hobo\'s cock with that broken {0}.',
    'you hit some hobo\'s dick but his rock hard boner shattered your {0}.',
    'that rusty old {0} that your grandpa gave you broke faster than I could nut.',
    'someone ratted you out to the cops and the SWAT team destroyed your {0}.',
    'you tried to slam a nigga but their surprise attack broke your {0}.',
    'you got horny and tried to use {0} as a dildo, but you got it stuck and couldn\'t get it out.'
  ],
  HELP: `{0} is **THE** cleanest bot around, and you can have it in **YOUR** server simply by \
clicking here: ${module.exports.LINKS.BOT}.\n\nFor all information about a module and their \
commands do \`${module.exports.PREFIX}module [module]\`.\n\nThe \`${module.exports.PREFIX}help \
<command>\` command may be used for view the usage and an example of any command.\n\nIf you have \
**ANY** questions, you may join the **Official DEA Discord Server:** ${module.exports.LINKS.SERVER}\
 for instant support along with a great community.`,
  INFORMATION: `The {0} cash system is based around **CHATTING**. For every message that you send \
every {1} seconds that is at least \
${module.exports.RESTRICTIONS.MINIMUM_MESSAGE_LENGTH} characters long, you will get \
{2} from this server.\n\nIf you are extra lucky, when sending messages you can win up to {3} in \
the **lottery**! The odds of winning the lottery are very low, but the more you chat, the higher \
chance you have of winning it!\n\nYou can watch yourself climb the \`${module.exports.PREFIX}\
leaderboards\` or you can just view your own cash with the \`${module.exports.PREFIX}cash [user]\` \
command.\n\nUse the \`${module.exports.PREFIX}ranks\` command to view the current ranks of a \
server. Whenever you reach the cash required for a rank, {4} will automatically give you the role.
\nFor all the other {5} related command information, use the \`${module.exports.PREFIX}help\` \
command which will provide you with everything you need to know!`,
  INVITE: `you may add cleanest bot around by clicking here: ${module.exports.LINKS.BOT}.
\nIf you have any questions or concerns, you may always join the \
**Official {0} Support Server:** ${module.exports.LINKS.SERVER}`,
  FISH: {
    CAUGHT: 'RIP NEMO LMFAO. Finding nemo, more like EATING NEMO ROFL! Good buddy, you got: {0}.',
    LOST: 'You had the fucking fish in your pocket on the way to the supermarket to get some \
spices, and the nigga flipping fish jumped into the sink and pulled some goddamn Finding Nemo \
shit and bounced.'
  },
  HUNT: {
    CAUGHT: 'Clean kill. Boss froth. Smooth beans. You got: {0}.',
    LOST: 'Nigga you just about had that deer but then he did that hoof kick thing and fucked up \
your buddy Chuck, so then you had to go bust a nut all over him and the GODDAMN deer got away.'
  },
  REVIVAL: {
    REPLY: 'you managed to kill {0}, but he was revived with his snowcap investment.',
    DM: '{0} tried to kill you, but your snowcap brought you back to life.'
  },
  ROB: {
    OK: 'whilst your target was at the bank, you disguised yourself as a clerk and offered to help \
him with his deposit. Luckily, you managed to snipe some cash from his account and the dude walked \
away without noticing. You robbed {0}.',
    FAIL: 'you snuck up behind the dude at the bank and surprised his fatass. Unfortunately for \
you, he was a SWAT agent and sent you to jail. You lost all the resources in the process.'
  },
  VAULT: {
    ADD_REPLY: 'you have successfully added {0} {1} to your gang\'s vault.',
    ADD_DM: '{0} has just added {1} {2} to your gang\'s vault.',
    MAXIMUM_AMOUNT: 'your gang\'s vault cannot hold any more items.',
    NO_DUMP_ITEMS: 'you don\'t have any items to dump into your gang\'s vault.',
    NEEDED_ITEMS: 'you don\'t have any of the following item{0} to dump: {1}.',
    DUMPED_DM: '{0} has dumped the following into your gang\'s vault:\n{1}',
    DUMPED_REPLY: 'you have successfully dumped the following into your gang\'s vault:\n{0}'
  },
  GANG: {
    INVALID_NAME: 'your gang\'s name may only be alphanumeric and contain 1 consecutive space that \
isn\'t at the beginning or end.',
    USED_NAME: 'a gang by the name `{0}` already exists.',
    CHANGED_NAME: 'you\'ve successfully changed your gang\'s name from {0} to {1}.',
    INVALID_DEMOTE: 'this member isn\'t an elder.',
    DEMOTE: 'you\'ve successfully demoted {0} from an elder in your gang.',
    MAX_GANGS: 'there can only be a maximum of {0} gangs in a server.',
    CREATED_GANG: 'you\'ve successfully created a gang with the name {0}',
    DEPOSIT_DM: '{0} has deposited {1} to your gang.',
    DEPOSIT_REPLY: 'you have successfully deposited {0} to your gang. Transaction fee: {1}.',
    OWNER_DESTROYED_GANG: 'you have successfully destroyed your gang.',
    NOT_IN_GANG: '{0} not in a gang.',
    IN_GANG: '{0} is already in a gang.',
    MAXIMUM_MEMBERS: 'your gang has the maximum amount of members in it.',
    LACK_PERMS: 'you cannot {0} anyone to your gang since you\'re not a leader or elder of it.',
    INVITED: '{0} is trying to invite you to his gang {1}, reply with "{2}" within 5 minutes \
to accept this.',
    UNINFORMED_REQUEST: 'I am unable to inform {0} of your join request.',
    INFORMED_REQUEST: 'this user has successfully been informed of your join request.',
    MEMBER_JOINED_DM: 'you\'ve successfully joined the gang {0}.',
    INVITER_JOINED_DM: 'you\'ve successfully let {0} join your gang.',
    NO_RESPONSE_REPLY: '{0} didn\'t respond to your join request.',
    ALREADY_JOINED_GANG_DM: '{0} has already joined a gang.',
    REQUESTED_JOINED_GANG_DM: 'you\'re unable to join {0} since you\'re already in a gang.'
  }
};

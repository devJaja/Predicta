// Mock data for local development / pre-deployment preview

export const MOCK_EVENTS = [
    {
        id: 0,
        title: 'Will Bitcoin surpass $200K before end of 2025?',
        status: 0,
        outcome: null,
        totalPool: 24_500_000, // microSTX
        optionCount: 2,
        createdAt: 142000,
        resolveTime: 162000,
        oracleThreshold: 3,
        oracleVotes: 1,
        options: ['Yes', 'No'],
        category: 'Crypto',
    },
    {
        id: 1,
        title: 'Which team wins the 2025 Champions League?',
        status: 0,
        outcome: null,
        totalPool: 18_000_000,
        optionCount: 4,
        createdAt: 141000,
        resolveTime: 160000,
        oracleThreshold: 3,
        oracleVotes: 0,
        options: ['Real Madrid', 'Man City', 'Barcelona', 'PSG'],
        category: 'Sports',
    },
    {
        id: 2,
        title: 'Will Stacks STX token reach $10 in Q2 2025?',
        status: 0,
        outcome: null,
        totalPool: 32_000_000,
        optionCount: 2,
        createdAt: 140500,
        resolveTime: 158000,
        oracleThreshold: 2,
        oracleVotes: 1,
        options: ['Yes', 'No'],
        category: 'Crypto',
    },
    {
        id: 3,
        title: 'Next US Federal Reserve rate decision?',
        status: 1,
        outcome: null,
        totalPool: 9_500_000,
        optionCount: 3,
        createdAt: 139000,
        resolveTime: 148000,
        oracleThreshold: 3,
        oracleVotes: 3,
        options: ['Cut 0.25%', 'Hold', 'Raise 0.25%'],
        category: 'Finance',
    },
    {
        id: 4,
        title: 'Will Ethereum merge to PoS generate more staking yield than 5% APY in 2025?',
        status: 2,
        outcome: 0,
        totalPool: 15_200_000,
        optionCount: 2,
        createdAt: 135000,
        resolveTime: 145000,
        oracleThreshold: 3,
        oracleVotes: 3,
        options: ['Yes', 'No'],
        category: 'Crypto',
    },
    {
        id: 5,
        title: 'Will Nigeria win the 2025 Africa Cup of Nations?',
        status: 0,
        outcome: null,
        totalPool: 11_000_000,
        optionCount: 2,
        createdAt: 141500,
        resolveTime: 165000,
        oracleThreshold: 3,
        oracleVotes: 0,
        options: ['Yes', 'No'],
        category: 'Sports',
    },
];

export const MOCK_USER = {
    address: 'SP2V4KW4X3XWNMPCB6JBM4Z1KCJR5NZCA3PTWHQX',
    balance: 485_000_000, // microSTX
    reputation: {
        score: 85,
        wins: 12,
        totalBets: 24,
    },
    badges: [1, 4],
    bets: [
        { eventId: 0, option: 0, amount: 2_000_000, claimed: false },
        { eventId: 2, option: 0, amount: 5_000_000, claimed: false },
        { eventId: 4, option: 0, amount: 3_000_000, claimed: true },
    ],
};

export const MOCK_LEADERBOARD = [
    { address: 'SP2V4KW4X3XWNMPCB6JBM4Z1KCJR5NZCA3PTWHQX', score: 320, wins: 32, totalBets: 58 },
    { address: 'SPJQ3Q6Y9H5T4NF7JPNV4XPZQBHJ5KTZZ8MT0YR', score: 280, wins: 28, totalBets: 48 },
    { address: 'SP1K1A1PMGD5RN521NKRP53TXK4V67YSWPG3HCQV', score: 210, wins: 21, totalBets: 40 },
    { address: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE', score: 180, wins: 18, totalBets: 35 },
    { address: 'SPNWZ5V55N6E7RQMB9C7BRNX4JKZFB8P4HXT7Y1F', score: 150, wins: 15, totalBets: 30 },
    { address: 'SP2B5QV5G9H4T4MF8JPNV5ZQBHJ5KTZZ8MT0YTP', score: 120, wins: 12, totalBets: 25 },
];

export const POOL_SPLITS = {
    // eventId -> option -> staked
    0: { 0: 14_500_000, 1: 10_000_000 },
    1: { 0: 8_000_000, 1: 5_500_000, 2: 2_500_000, 3: 2_000_000 },
    2: { 0: 22_000_000, 1: 10_000_000 },
    3: { 0: 3_500_000, 1: 4_000_000, 2: 2_000_000 },
    4: { 0: 11_000_000, 1: 4_200_000 },
    5: { 0: 7_000_000, 1: 4_000_000 },
};

// Stacks Network Configuration
// Toggle between testnet and mainnet via VITE_NETWORK env var

export const NETWORK = import.meta.env.VITE_NETWORK || 'testnet';

// Contract deployer address — update after deployment
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

export const CONTRACT_NAMES = {
    CORE: 'predictify-core',
    ORACLE: 'predictify-oracle',
    RESOLUTION: 'predictify-resolution',
    NFTS: 'predictify-nfts',
};

export const BADGE_TYPES = {
    TOP_PREDICTOR: 1,
    WIN_STREAK_10: 2,
    LIQUIDITY_CHAMPION: 3,
    EVENT_CREATOR: 4,
};

export const BADGE_INFO = {
    1: { name: 'Top Predictor', icon: '🏆', description: 'Achieved elite prediction accuracy', color: '#fbbf24' },
    2: { name: 'Win Streak x10', icon: '🔥', description: '10 consecutive winning predictions', color: '#f97316' },
    3: { name: 'Liquidity Champion', icon: '💎', description: 'Massive contributions to prediction pools', color: '#22d3ee' },
    4: { name: 'Event Creator', icon: '⚡', description: 'Created and managed prediction markets', color: '#a78bfa' },
};

export const EVENT_STATUS = {
    OPEN: 0,
    CLOSED: 1,
    RESOLVED: 2,
    INVALID: 3,
};

export const STATUS_LABELS = {
    0: 'Open',
    1: 'Closed',
    2: 'Resolved',
    3: 'Invalid',
};

// 1 STX = 1,000,000 microSTX
export const STX_DECIMALS = 1_000_000;

export const formatSTX = (microSTX) => {
    if (!microSTX) return '0.00 STX';
    const stx = Number(microSTX) / STX_DECIMALS;
    return stx >= 1000
        ? `${(stx / 1000).toFixed(2)}K STX`
        : `${stx.toFixed(2)} STX`;
};

export const toMicroSTX = (stx) => Math.floor(Number(stx) * STX_DECIMALS);

export const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const timeUntil = (blockHeight, currentBlock) => {
    // ~10 min per block on Stacks
    const blocksLeft = Number(blockHeight) - Number(currentBlock);
    if (blocksLeft <= 0) return 'Ended';
    const minutes = blocksLeft * 10;
    if (minutes < 60) return `${minutes}m left`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}h left`;
    return `${Math.round(minutes / 1440)}d left`;
};

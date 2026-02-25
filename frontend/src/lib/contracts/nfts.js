import {
    callReadOnlyFunction,
    cvToJSON,
    uintCV,
    principalCV,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAMES, NETWORK } from '../stacksConfig';

const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

export async function hasBadge(userAddress, badgeId) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.NFTS,
            functionName: 'has-badge',
            functionArgs: [principalCV(userAddress), uintCV(badgeId)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return cvToJSON(result)?.value === true;
    } catch {
        return false;
    }
}

export async function getBadge(userAddress, badgeId) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.NFTS,
            functionName: 'get-badge',
            functionArgs: [principalCV(userAddress), uintCV(badgeId)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return cvToJSON(result);
    } catch {
        return null;
    }
}

export async function getUserBadges(userAddress) {
    const badgeIds = [1, 2, 3, 4];
    const results = await Promise.all(
        badgeIds.map(async (id) => ({ id, has: await hasBadge(userAddress, id) }))
    );
    return results.filter((b) => b.has).map((b) => b.id);
}

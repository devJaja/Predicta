import {
    callReadOnlyFunction,
    cvToJSON,
    uintCV,
    principalCV,
    stringAsciiCV,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAMES, NETWORK, STX_DECIMALS } from '../stacksConfig';

const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

const isMainnet = NETWORK === 'mainnet';
const baseUrl = isMainnet
    ? 'https://api.mainnet.hiro.so'
    : 'https://api.testnet.hiro.so';

// ─── Read-Only Calls ──────────────────────────────────────────────

export async function getEvent(eventId) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.CORE,
            functionName: 'get-event',
            functionArgs: [uintCV(eventId)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return cvToJSON(result);
    } catch (err) {
        console.error('getEvent failed:', err);
        return null;
    }
}

export async function getBet(eventId, userAddress) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.CORE,
            functionName: 'get-bet',
            functionArgs: [uintCV(eventId), principalCV(userAddress)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return cvToJSON(result);
    } catch (err) {
        console.error('getBet failed:', err);
        return null;
    }
}

export async function getPool(eventId, option) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.CORE,
            functionName: 'get-pool',
            functionArgs: [uintCV(eventId), uintCV(option)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return cvToJSON(result);
    } catch (err) {
        console.error('getPool failed:', err);
        return null;
    }
}

export async function getReputation(userAddress) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.CORE,
            functionName: 'get-reputation',
            functionArgs: [principalCV(userAddress)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return cvToJSON(result);
    } catch (err) {
        console.error('getReputation failed:', err);
        return null;
    }
}

export async function getEventNonce() {
    try {
        const response = await fetch(
            `${baseUrl}/v2/contracts/data-var/${CONTRACT_ADDRESS}/${CONTRACT_NAMES.CORE}/event-nonce?proof=0`
        );
        const data = await response.json();
        return parseInt(data?.data?.replace('0x', '') ?? '0', 16);
    } catch {
        return 0;
    }
}

// ─── Write Calls (via openContractCall from @stacks/connect) ─────

export function buildCreateEventOptions(title, optionCount, resolveTime, oracleThreshold) {
    const { uintCV, stringAsciiCV } = require('@stacks/transactions');
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAMES.CORE,
        functionName: 'create-event',
        functionArgs: [
            stringAsciiCV(title),
            uintCV(optionCount),
            uintCV(resolveTime),
            uintCV(oracleThreshold),
        ],
        network,
        postConditionMode: 1, // Allow
    };
}

export function buildPlaceBetOptions(eventId, option, amountMicroSTX) {
    const { makeStandardSTXPostCondition, FungibleConditionCode } = require('@stacks/transactions');
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAMES.CORE,
        functionName: 'place-bet',
        functionArgs: [uintCV(eventId), uintCV(option), uintCV(amountMicroSTX)],
        network,
        postConditions: [],
        postConditionMode: 1,
    };
}

export function buildClaimWinningsOptions(eventId) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAMES.CORE,
        functionName: 'claim-winnings',
        functionArgs: [uintCV(eventId)],
        network,
        postConditionMode: 1,
    };
}

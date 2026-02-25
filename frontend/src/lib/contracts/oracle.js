import {
    callReadOnlyFunction,
    cvToJSON,
    uintCV,
    principalCV,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAMES, NETWORK } from '../stacksConfig';

const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

export async function isOracle(address) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.ORACLE,
            functionName: 'is-oracle',
            functionArgs: [principalCV(address)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return cvToJSON(result)?.value === true;
    } catch {
        return false;
    }
}

export async function getVoteCount(eventId, outcome) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.ORACLE,
            functionName: 'get-vote-count',
            functionArgs: [uintCV(eventId), uintCV(outcome)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return parseInt(cvToJSON(result)?.value ?? '0');
    } catch {
        return 0;
    }
}

export async function hasVoted(eventId, oracleAddress) {
    try {
        const result = await callReadOnlyFunction({
            network,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAMES.ORACLE,
            functionName: 'has-voted',
            functionArgs: [uintCV(eventId), principalCV(oracleAddress)],
            senderAddress: CONTRACT_ADDRESS,
        });
        return cvToJSON(result)?.value === true;
    } catch {
        return false;
    }
}

export function buildSubmitVoteOptions(eventId, outcome) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAMES.ORACLE,
        functionName: 'submit-vote',
        functionArgs: [uintCV(eventId), uintCV(outcome)],
        network,
        postConditionMode: 1,
    };
}

export function buildAddOracleOptions(oracleAddress) {
    return {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAMES.ORACLE,
        functionName: 'add-oracle',
        functionArgs: [principalCV(oracleAddress)],
        network,
        postConditionMode: 1,
    };
}

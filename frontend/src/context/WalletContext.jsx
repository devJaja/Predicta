import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { NETWORK, formatAddress } from '../lib/stacksConfig';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
    const [address, setAddress] = useState(() => {
        if (userSession.isUserSignedIn()) {
            const data = userSession.loadUserData();
            return NETWORK === 'mainnet'
                ? data?.profile?.stxAddress?.mainnet
                : data?.profile?.stxAddress?.testnet;
        }
        return null;
    });

    const connect = useCallback(() => {
        showConnect({
            appDetails: {
                name: 'Predicta',
                icon: window.location.origin + '/favicon.svg',
            },
            userSession,
            network,
            onFinish: () => {
                const data = userSession.loadUserData();
                const addr = NETWORK === 'mainnet'
                    ? data?.profile?.stxAddress?.mainnet
                    : data?.profile?.stxAddress?.testnet;
                setAddress(addr);
            },
            onCancel: () => console.log('Wallet connection cancelled'),
        });
    }, []);

    const disconnect = useCallback(() => {
        userSession.signUserOut();
        setAddress(null);
    }, []);

    const isConnected = Boolean(address);
    const shortAddress = formatAddress(address);

    return (
        <WalletContext.Provider value={{ address, shortAddress, isConnected, connect, disconnect, network }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const ctx = useContext(WalletContext);
    if (!ctx) throw new Error('useWallet must be used within WalletProvider');
    return ctx;
}

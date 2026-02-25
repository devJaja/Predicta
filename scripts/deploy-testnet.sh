#!/bin/bash
# Testnet Deployment - Test before mainnet
set -e

echo "🧪 Predicta Testnet Deployment"
echo "================================"

# Check Clarinet
if ! command -v clarinet &> /dev/null; then
    echo "❌ Clarinet not installed"
    exit 1
fi

echo "✓ Running testnet deployment..."

# Generate testnet plan
clarinet deployments generate --testnet

echo ""
echo "✓ Testnet deployment plan generated"
echo ""
echo "To deploy to testnet:"
echo "1. Get testnet STX from faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet"
echo "2. Run: clarinet deployments apply -p deployments/default.testnet-plan.yaml"
echo ""
echo "After successful testnet deployment, proceed to mainnet"

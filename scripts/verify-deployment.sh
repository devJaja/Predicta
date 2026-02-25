#!/bin/bash
# Post-deployment verification script

CONTRACT_ADDRESS=$1

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "Usage: ./verify-deployment.sh <contract-address>"
    exit 1
fi

echo "🔍 Verifying deployment: $CONTRACT_ADDRESS"
echo ""

# Check contract exists
echo "Checking contract on mainnet..."
curl -s "https://api.mainnet.hiro.so/v2/contracts/interface/$CONTRACT_ADDRESS" | jq .

echo ""
echo "✓ Verification complete"
echo ""
echo "Next steps:"
echo "1. Test read-only functions"
echo "2. Add oracle addresses"
echo "3. Update frontend configuration"
echo "4. Monitor first transactions"

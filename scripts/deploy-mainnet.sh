#!/bin/bash
# Predicta Mainnet Deployment Script
# Professional deployment with safety checks and verification

set -e

echo "🚀 Predicta Mainnet Deployment"
echo "================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo -e "${RED}❌ Clarinet is not installed${NC}"
    echo "Install: curl -L https://github.com/hirosystems/clarinet/releases/download/v2.0.0/clarinet-linux-x64.tar.gz | tar xz"
    exit 1
fi

echo -e "${GREEN}✓ Clarinet found${NC}"

# Check if contracts exist
if [ ! -f "contracts/predictify-core.clar" ]; then
    echo -e "${RED}❌ Contract files not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Contract files found${NC}"

# Pre-deployment checks
echo ""
echo "📋 Pre-deployment Checklist:"
echo "----------------------------"

# 1. Syntax check
echo -n "1. Checking contract syntax... "
if clarinet check > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Syntax errors found${NC}"
    clarinet check
    exit 1
fi

# 2. Run tests
echo -n "2. Running test suite... "
if clarinet test > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Tests failed or not found${NC}"
fi

# 3. Check wallet setup
echo ""
echo "3. Wallet Configuration:"
echo "   Please ensure you have:"
echo "   - Mainnet STX wallet with sufficient balance"
echo "   - Private key or hardware wallet ready"
echo "   - Estimated deployment cost: ~5-10 STX"

# 4. Security audit reminder
echo ""
echo -e "${YELLOW}⚠ SECURITY CHECKLIST:${NC}"
echo "   □ Code has been audited"
echo "   □ All tests passing"
echo "   □ No hardcoded secrets"
echo "   □ Access controls verified"
echo "   □ Emergency pause mechanism tested"
echo ""

read -p "Have you completed the security checklist? (yes/no): " security_check
if [ "$security_check" != "yes" ]; then
    echo -e "${RED}Deployment cancelled. Complete security audit first.${NC}"
    exit 1
fi

# 5. Deployment confirmation
echo ""
echo -e "${YELLOW}⚠ WARNING: You are about to deploy to MAINNET${NC}"
echo "   This action is IRREVERSIBLE and will cost real STX"
echo ""
read -p "Type 'DEPLOY' to continue: " confirm

if [ "$confirm" != "DEPLOY" ]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 1
fi

# Deployment
echo ""
echo "🔄 Starting deployment..."
echo ""

# Generate deployment plan
clarinet deployments generate --mainnet

echo ""
echo "📝 Deployment plan generated at: deployments/default.mainnet-plan.yaml"
echo ""
echo "Next steps:"
echo "1. Review the deployment plan"
echo "2. Fund your deployment wallet"
echo "3. Run: clarinet deployments apply -p deployments/default.mainnet-plan.yaml"
echo ""
echo -e "${GREEN}✓ Pre-deployment checks complete${NC}"
echo ""
echo "📚 Documentation: https://docs.hiro.so/clarinet/how-to-guides/how-to-deploy-with-clarinet"

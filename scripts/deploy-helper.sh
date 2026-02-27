#!/bin/bash
# Quick Mainnet Deployment via Hiro Platform

echo "🚀 Predicta Mainnet Deployment Helper"
echo "======================================"
echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "1. ✅ Contracts ready:"
ls -1 contracts/*.clar | sed 's/^/   - /'
echo ""
echo "2. 🌐 Deploy via Hiro Platform:"
echo "   → https://platform.hiro.so"
echo ""
echo "3. 💰 Ensure you have 10+ STX in your wallet"
echo ""
echo "4. 📝 Deployment order:"
echo "   1) predicta-oracle"
echo "   2) predicta-resolution"
echo "   3) predicta-core"
echo "   4) predicta-nfts"
echo ""
echo "5. 💾 After deployment, save contract addresses:"
echo "   Create: frontend/.env.production"
echo ""
echo "Example .env.production:"
echo "------------------------"
cat << 'EOF'
VITE_NETWORK=mainnet
VITE_CORE_CONTRACT=SP<YOUR_ADDRESS>.predicta-core
VITE_ORACLE_CONTRACT=SP<YOUR_ADDRESS>.predicta-oracle
VITE_RESOLUTION_CONTRACT=SP<YOUR_ADDRESS>.predicta-resolution
VITE_NFTS_CONTRACT=SP<YOUR_ADDRESS>.predicta-nfts
VITE_STACKS_API=https://api.mainnet.hiro.so
EOF
echo ""
echo "📚 Full guide: MAINNET-DEPLOY.md"
echo ""
echo "🚀 Ready to deploy? Open https://platform.hiro.so"

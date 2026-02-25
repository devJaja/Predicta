# 🚀 Predictify Mainnet Deployment Guide

## Quick Start - Professional Deployment

### Option 1: Deploy via Hiro Platform (Recommended for Mainnet)

**Step 1: Prepare Your Wallet**
```bash
# You need:
# - Leather or Xverse wallet
# - 10+ STX for deployment costs
# - Your wallet address ready
```

**Step 2: Use Hiro Platform**
1. Go to https://platform.hiro.so
2. Create new project
3. Upload your contracts:
   - `contracts/predictify-core.clar`
   - `contracts/predictify-oracle.clar`
   - `contracts/predictify-resolution.clar`
   - `contracts/predictify-nfts.clar`
4. Click "Deploy to Mainnet"
5. Confirm transactions in your wallet

**Step 3: Save Contract Addresses**
After deployment, save your contract addresses:
```
predictify-core: SP...
predictify-oracle: SP...
predictify-resolution: SP...
predictify-nfts: SP...
```

---

### Option 2: Deploy via Clarinet CLI

**Prerequisites:**
```bash
# Install Clarinet
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/

# Verify installation
clarinet --version
```

**Deployment Steps:**

1. **Test Locally First**
```bash
cd /home/jaja/Desktop/my-project/predicta

# Check syntax
clarinet check

# Run tests (if available)
clarinet test
```

2. **Deploy to Testnet**
```bash
# Generate testnet deployment plan
clarinet deployments generate --testnet

# Get testnet STX from faucet
# https://explorer.hiro.so/sandbox/faucet?chain=testnet

# Deploy
clarinet deployments apply --testnet
```

3. **Deploy to Mainnet** (After testnet success)
```bash
# Generate mainnet plan
clarinet deployments generate --mainnet

# Review the plan carefully
cat deployments/default.mainnet-plan.yaml

# Deploy (IRREVERSIBLE - costs real STX)
clarinet deployments apply --mainnet
```

---

### Option 3: Manual Deployment via Stacks Explorer

1. Go to https://explorer.hiro.so
2. Connect your wallet
3. Navigate to "Deploy Contract"
4. Paste contract code
5. Set contract name
6. Deploy and confirm

---

## 📋 Post-Deployment Checklist

### 1. Verify Deployment
```bash
# Check contract on explorer
https://explorer.hiro.so/txid/ST...?chain=mainnet

# Verify contract interface
curl "https://api.mainnet.hiro.so/v2/contracts/interface/SP.../predictify-core"
```

### 2. Initialize Contracts

**Add Oracle Addresses:**
```clarity
;; Call from deployer wallet
(contract-call? .predictify-oracle add-oracle 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)
(contract-call? .predictify-oracle add-oracle 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE)
```

### 3. Update Frontend Configuration

Create `.env.production`:
```bash
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CORE_CONTRACT=SP.../predictify-core
NEXT_PUBLIC_ORACLE_CONTRACT=SP.../predictify-oracle
NEXT_PUBLIC_RESOLUTION_CONTRACT=SP.../predictify-resolution
NEXT_PUBLIC_NFTS_CONTRACT=SP.../predictify-nfts
```

### 4. Test Contract Functions

Test each function on mainnet with small amounts:
- Create a test event
- Place a small bet
- Verify oracle voting works
- Test claim mechanism

---

## 💰 Deployment Costs

| Item | Cost |
|------|------|
| Contract Deployment (4 contracts) | ~5-7 STX |
| Initial Oracle Setup | ~0.5 STX |
| Test Transactions | ~1 STX |
| **Total Estimated** | **~7-9 STX** |

---

## 🔐 Security Reminders

✅ **Before Mainnet:**
- [ ] All contracts tested on testnet
- [ ] Security audit completed
- [ ] No hardcoded private keys
- [ ] Oracle addresses verified
- [ ] Emergency procedures documented

⚠️ **Important:**
- Mainnet deployment is IRREVERSIBLE
- Contracts cannot be modified after deployment
- Test everything on testnet first
- Keep deployment wallet secure

---

## 📞 Need Help?

- **Stacks Discord**: https://discord.gg/stacks
- **Hiro Docs**: https://docs.hiro.so
- **Clarity Language**: https://book.clarity-lang.org

---

## 🎯 Quick Deployment Command

For experienced developers:
```bash
# One-command deployment (after setup)
./scripts/deploy-mainnet.sh
```

---

**Ready to deploy? Start with testnet, then proceed to mainnet!** 🚀

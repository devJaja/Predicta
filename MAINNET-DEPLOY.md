# 🚀 Predicta Mainnet Deployment

## Recommended: Deploy via Hiro Platform

### Step 1: Prepare Contracts
Your contracts are ready at:
- `contracts/predicta-core.clar`
- `contracts/predicta-oracle.clar`
- `contracts/predicta-resolution.clar`
- `contracts/predicta-nfts.clar`

### Step 2: Deploy via Hiro Platform

1. **Go to Hiro Platform**: https://platform.hiro.so
2. **Connect Wallet**: Use Leather or Xverse with 10+ STX
3. **Create Project**: Click "New Project"
4. **Upload Contracts**: Upload all 4 contracts
5. **Deploy Order** (important):
   - Deploy `predicta-oracle` first
   - Deploy `predicta-resolution` second
   - Deploy `predicta-core` third
   - Deploy `predicta-nfts` last

6. **Confirm Transactions**: Approve each in your wallet

### Step 3: Save Contract Addresses

After deployment, save these addresses:
```
predicta-oracle: SP...
predicta-resolution: SP...
predicta-core: SP...
predicta-nfts: SP...
```

### Step 4: Initialize Contracts

Add authorized oracles (from your wallet):
```clarity
(contract-call? .predicta-oracle add-oracle 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7)
(contract-call? .predicta-oracle add-oracle 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE)
(contract-call? .predicta-oracle add-oracle 'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS)
```

### Step 5: Update Frontend

Create `frontend/.env.production`:
```bash
VITE_NETWORK=mainnet
VITE_CORE_CONTRACT=SP<YOUR_ADDRESS>.predicta-core
VITE_ORACLE_CONTRACT=SP<YOUR_ADDRESS>.predicta-oracle
VITE_RESOLUTION_CONTRACT=SP<YOUR_ADDRESS>.predicta-resolution
VITE_NFTS_CONTRACT=SP<YOUR_ADDRESS>.predicta-nfts
VITE_STACKS_API=https://api.mainnet.hiro.so
```

### Step 6: Test on Mainnet

Test with small amounts:
1. Create a test event (0.1 STX)
2. Place a small bet (0.1 STX)
3. Verify oracle voting
4. Test claim mechanism

---

## Alternative: Deploy via Stacks Explorer

1. Go to: https://explorer.hiro.so
2. Connect your wallet
3. Click "Deploy Contract"
4. For each contract:
   - Paste contract code
   - Set contract name (e.g., `predicta-core`)
   - Click "Deploy"
   - Confirm transaction

---

## Alternative: Deploy via Clarinet CLI

### Prerequisites
```bash
# Ensure Clarinet is installed
clarinet --version  # Should show 3.13.1 or higher
```

### Generate Deployment Plan
```bash
cd /home/jaja/Desktop/my-project/predicta
clarinet deployments generate --mainnet
```

This creates: `deployments/default.mainnet-plan.yaml`

### Review the Plan
```bash
cat deployments/default.mainnet-plan.yaml
```

### Deploy to Mainnet
```bash
# This will prompt for your wallet
clarinet deployments apply -p deployments/default.mainnet-plan.yaml --mainnet
```

---

## 💰 Estimated Costs

| Item | Cost (STX) |
|------|------------|
| predicta-oracle | ~1.5 |
| predicta-resolution | ~1.0 |
| predicta-core | ~2.5 |
| predicta-nfts | ~1.5 |
| Oracle initialization | ~0.5 |
| **Total** | **~7-8 STX** |

---

## ✅ Post-Deployment Checklist

- [ ] All 4 contracts deployed
- [ ] Contract addresses saved
- [ ] Oracles added and authorized
- [ ] Frontend .env.production updated
- [ ] Test event created successfully
- [ ] Test bet placed successfully
- [ ] Oracle voting tested
- [ ] Claim mechanism verified
- [ ] Frontend deployed and connected

---

## 🔗 Useful Links

- **Hiro Platform**: https://platform.hiro.so
- **Stacks Explorer**: https://explorer.hiro.so
- **API Docs**: https://docs.hiro.so/stacks-blockchain-api
- **Clarinet Docs**: https://docs.hiro.so/clarinet

---

## 🆘 Troubleshooting

**Issue**: Transaction fails
- Check you have enough STX (10+ recommended)
- Verify network is set to mainnet
- Check gas fees aren't too low

**Issue**: Contract call fails
- Verify contract is deployed
- Check function parameters
- Ensure you're calling from authorized address

**Issue**: Frontend can't connect
- Verify contract addresses in .env
- Check network is set to mainnet
- Clear browser cache and reconnect wallet

---

## 📞 Support

- **Stacks Discord**: https://discord.gg/stacks
- **GitHub Issues**: Create an issue in your repo
- **Hiro Support**: support@hiro.so

---

**Ready to deploy? Start with Hiro Platform for the easiest experience!** 🚀

# Predictify Deployment Guide

## 🚀 Professional Mainnet Deployment

### Prerequisites

1. **Install Clarinet**
```bash
curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/
```

2. **Wallet Setup**
- Mainnet STX wallet (Leather/Xverse)
- Minimum 10 STX for deployment + gas
- Private key or hardware wallet

3. **Security Audit**
- [ ] Code reviewed by security expert
- [ ] All tests passing
- [ ] No hardcoded secrets
- [ ] Access controls verified
- [ ] Emergency mechanisms tested

---

## 📋 Deployment Steps

### Step 1: Test on Testnet First

```bash
# Make scripts executable
chmod +x scripts/deploy-testnet.sh
chmod +x scripts/deploy-mainnet.sh

# Deploy to testnet
./scripts/deploy-testnet.sh

# Get testnet STX
# Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet

# Apply testnet deployment
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### Step 2: Verify Testnet Deployment

```bash
# Test all contract functions on testnet
# - Create event
# - Place bets
# - Oracle voting
# - Claim winnings
# - Check reputation
# - Mint badges
```

### Step 3: Mainnet Deployment

```bash
# Run pre-deployment checks
./scripts/deploy-mainnet.sh

# Review deployment plan
cat deployments/default.mainnet-plan.yaml

# Apply mainnet deployment (IRREVERSIBLE)
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

---

## 🔐 Security Best Practices

### Before Deployment

1. **Code Audit**
   - Professional security audit
   - Peer review by experienced Clarity developers
   - Check for common vulnerabilities

2. **Testing**
   - 100% test coverage
   - Integration tests
   - Edge case testing
   - Gas optimization

3. **Access Control**
   - Verify oracle addresses
   - Check contract owner permissions
   - Test emergency pause

### After Deployment

1. **Verification**
   - Verify contract on Stacks Explorer
   - Test read-only functions
   - Confirm contract addresses

2. **Monitoring**
   - Set up transaction monitoring
   - Error tracking
   - Gas usage alerts

3. **Documentation**
   - Document deployed contract addresses
   - Update frontend configuration
   - Publish audit reports

---

## 📊 Deployment Costs

| Contract | Estimated Cost |
|----------|---------------|
| predictify-core | ~2-3 STX |
| predictify-oracle | ~1-2 STX |
| predictify-resolution | ~1 STX |
| predictify-nfts | ~1 STX |
| **Total** | **~5-7 STX** |

*Plus gas fees for transactions*

---

## 🔧 Post-Deployment Setup

### 1. Add Oracle Addresses

```clarity
;; Call from contract owner
(contract-call? .predictify-oracle add-oracle 'SP...)
```

### 2. Initialize First Event (Optional)

```clarity
(contract-call? .predictify-core create-event 
  "Will BTC reach $100K in 2026?" 
  u2  ;; 2 options (YES/NO)
  u1234567890  ;; resolve timestamp
  u3  ;; 3 of 5 oracle threshold
)
```

### 3. Update Frontend Config

```javascript
// config/contracts.js
export const CONTRACTS = {
  core: 'SP...predictify-core',
  oracle: 'SP...predictify-oracle',
  resolution: 'SP...predictify-resolution',
  nfts: 'SP...predictify-nfts'
}
```

---

## 🆘 Emergency Procedures

### If Issues Detected

1. **DO NOT PANIC**
2. Document the issue
3. Pause new interactions (if pause mechanism exists)
4. Contact security team
5. Prepare incident report

### Contract Upgrade Path

Clarity contracts are immutable. For upgrades:
1. Deploy new version
2. Migrate state (if possible)
3. Update frontend to new contract
4. Deprecate old contract

---

## 📞 Support

- **Documentation**: https://docs.hiro.so
- **Discord**: Stacks Discord #clarity
- **Security Issues**: security@predictify.io

---

## ✅ Deployment Checklist

- [ ] Testnet deployment successful
- [ ] All functions tested on testnet
- [ ] Security audit completed
- [ ] Wallet funded (10+ STX)
- [ ] Deployment plan reviewed
- [ ] Team notified
- [ ] Monitoring setup ready
- [ ] Frontend configuration prepared
- [ ] Emergency procedures documented
- [ ] Mainnet deployment executed
- [ ] Contract verification completed
- [ ] Oracle addresses added
- [ ] Frontend deployed
- [ ] Announcement prepared

---

**⚠️ REMEMBER: Mainnet deployment is IRREVERSIBLE. Test thoroughly on testnet first!**

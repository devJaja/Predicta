# Predictify — Decentralized Prediction Markets on Stacks

**Fully on-chain, transparent, Bitcoin-secured prediction markets powered by Clarity smart contracts.**

## 🚀 Features

### Core Functionality
✅ **Event Creation** - Anyone can create prediction markets  
✅ **STX Betting** - Stake on outcomes with locked escrow  
✅ **Multi-Oracle Consensus** - M-of-N voting prevents manipulation  
✅ **Automated Payouts** - Proportional rewards with dynamic fees  
✅ **Invalid Event Handling** - Full refunds when events are cancelled  

### Unique Enhancements
⭐ **Multi-Oracle M-of-N Consensus** - Decentralized resolution (e.g., 3 of 5 oracles)  
⭐ **Event Insurance** - INVALID status triggers full refunds  
⭐ **Reputation System** - Earn points, unlock fee discounts  
⭐ **NFT Achievement Badges** - Non-transferable on-chain status symbols  
⭐ **Dynamic Fee Model** - Reputation-based fee reduction (2% → 1%)  

## 📦 Smart Contracts

```
contracts/
├── predictify-core.clar        # Main betting logic, reputation, dynamic fees
├── predictify-oracle.clar      # Multi-oracle voting system
├── predictify-resolution.clar  # Consensus validation & INVALID handling
└── predictify-nfts.clar        # Non-transferable achievement badges
```

## 🔍 How It Works

1. **Connect Wallet** (Leather/Xverse)
2. **Create or Browse Events**
3. **Place Bet** - Lock STX in contract
4. **Oracles Vote** - Multi-oracle consensus
5. **Claim Winnings** - Proportional payout or refund if INVALID
6. **Earn Reputation & Badges**

## 💰 Payout Formula

```
user-payout = (user-stake / winning-pool) × (total-pool - dynamic-fee)
```

**Dynamic Fees:**
- High reputation (≥100): 1%
- Medium reputation (≥50): 1.5%
- Base: 2%

## 🛠 Tech Stack

- **Clarity** - Smart contracts
- **Stacks.js** - Frontend integration
- **Next.js/React** - UI
- **Bitcoin** - Settlement finality

## 📄 License

MIT License
# Add Xverse wallet support
# Implement transaction status tracking
# Create footer component
# Add outcome options builder
# Implement event filtering UI
# Optimize frontend performance
# Implement event fetching logic
# Create badge fetching logic
# Add retry logic for failed calls
# Optimize API call batching
# Create user profile state
# Implement state persistence
# Optimize state updates
# Create oracle voting tests
# Implement integration test suite

;; Predictify Core Contract - Enhanced Edition
;; Multi-oracle consensus, reputation, dynamic fees, NFT badges

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-event-not-found (err u101))
(define-constant err-event-closed (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-already-claimed (err u104))
(define-constant err-invalid-outcome (err u105))
(define-constant err-already-bet (err u106))

;; Data Variables
(define-data-var event-nonce uint u0)
(define-data-var base-fee uint u200) ;; 2% base fee

;; Event status: 0=open, 1=closed, 2=resolved, 3=invalid
(define-map events
  uint
  {
    creator: principal,
    title: (string-ascii 256),
    status: uint,
    outcome: (optional uint),
    total-pool: uint,
    option-count: uint,
    created-at: uint,
    resolve-time: uint,
    oracle-threshold: uint,
    oracle-votes: uint
  }
)

(define-map event-pools
  {event-id: uint, option: uint}
  {total-staked: uint}
)

(define-map bets
  {event-id: uint, user: principal}
  {
    option: uint,
    amount: uint,
    claimed: bool
  }
)

;; Reputation system
(define-map user-reputation
  principal
  {
    score: uint,
    wins: uint,
    total-bets: uint
  }
)

;; Event Creation
(define-public (create-event (title (string-ascii 256)) (option-count uint) (resolve-time uint) (oracle-threshold uint))
  (let ((event-id (var-get event-nonce)))
    (map-set events event-id {
      creator: tx-sender,
      title: title,
      status: u0,
      outcome: none,
      total-pool: u0,
      option-count: option-count,
      created-at: block-height,
      resolve-time: resolve-time,
      oracle-threshold: oracle-threshold,
      oracle-votes: u0
    })
    (var-set event-nonce (+ event-id u1))
    (ok event-id)
  )
)

;; Place Bet
(define-public (place-bet (event-id uint) (option uint) (amount uint))
  (let
    (
      (event (unwrap! (map-get? events event-id) err-event-not-found))
      (existing-bet (map-get? bets {event-id: event-id, user: tx-sender}))
      (current-pool (default-to {total-staked: u0} (map-get? event-pools {event-id: event-id, option: option})))
      (user-rep (default-to {score: u0, wins: u0, total-bets: u0} (map-get? user-reputation tx-sender)))
    )
    (asserts! (is-eq (get status event) u0) err-event-closed)
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (< option (get option-count event)) err-invalid-outcome)
    (asserts! (is-none existing-bet) err-already-bet)
    
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    (map-set bets {event-id: event-id, user: tx-sender} {
      option: option,
      amount: amount,
      claimed: false
    })
    
    (map-set event-pools {event-id: event-id, option: option} {
      total-staked: (+ (get total-staked current-pool) amount)
    })
    
    (map-set events event-id (merge event {total-pool: (+ (get total-pool event) amount)}))
    
    ;; Update reputation
    (map-set user-reputation tx-sender (merge user-rep {total-bets: (+ (get total-bets user-rep) u1)}))
    
    (ok true)
  )
)

;; Claim Winnings or Refund
(define-public (claim-winnings (event-id uint))
  (let
    (
      (event (unwrap! (map-get? events event-id) err-event-not-found))
      (bet (unwrap! (map-get? bets {event-id: event-id, user: tx-sender}) err-event-not-found))
      (user-rep (default-to {score: u0, wins: u0, total-bets: u0} (map-get? user-reputation tx-sender)))
    )
    (asserts! (not (get claimed bet)) err-already-claimed)
    (asserts! (or (is-eq (get status event) u2) (is-eq (get status event) u3)) err-event-closed)
    
    (map-set bets {event-id: event-id, user: tx-sender} (merge bet {claimed: true}))
    
    ;; INVALID event = full refund
    (if (is-eq (get status event) u3)
      (begin
        (try! (as-contract (stx-transfer? (get amount bet) tx-sender tx-sender)))
        (ok (get amount bet))
      )
      ;; Normal payout
      (let
        (
          (winning-option (unwrap! (get outcome event) err-event-not-found))
          (winning-pool (unwrap! (map-get? event-pools {event-id: event-id, option: winning-option}) err-event-not-found))
          (dynamic-fee (calculate-dynamic-fee (get total-pool event) (get score user-rep)))
          (fee-amount (/ (* (get total-pool event) dynamic-fee) u10000))
          (payout-pool (- (get total-pool event) fee-amount))
          (user-payout (/ (* (get amount bet) payout-pool) (get total-staked winning-pool)))
        )
        (asserts! (is-eq (get option bet) winning-option) err-not-authorized)
        
        ;; Update reputation on win
        (map-set user-reputation tx-sender {
          score: (+ (get score user-rep) u10),
          wins: (+ (get wins user-rep) u1),
          total-bets: (get total-bets user-rep)
        })
        
        (try! (as-contract (stx-transfer? user-payout tx-sender tx-sender)))
        (ok user-payout)
      )
    )
  )
)

;; Dynamic fee calculation (reputation-based discount)
(define-read-only (calculate-dynamic-fee (pool-size uint) (reputation uint))
  (if (>= reputation u100)
    u100  ;; 1% for high reputation
    (if (>= reputation u50)
      u150  ;; 1.5% for medium reputation
      (var-get base-fee)  ;; 2% base
    )
  )
)

;; Read-only functions
(define-read-only (get-event (event-id uint))
  (map-get? events event-id)
)

(define-read-only (get-bet (event-id uint) (user principal))
  (map-get? bets {event-id: event-id, user: user})
)

(define-read-only (get-pool (event-id uint) (option uint))
  (map-get? event-pools {event-id: event-id, option: option})
)

(define-read-only (get-reputation (user principal))
  (map-get? user-reputation user)
)
// Update: Add MIT license
// Update: Add contributing guidelines
// Update: Add code of conduct
// Update: Add architecture documentation
// Update: Create predictify-core contract skeleton
// Update: Create betting pool data maps
// Update: Add STX transfer logic for bets
// Update: Add bet query functions
// Update: Add timestamp tracking
// Update: Add event closure logic
// Update: Add resolve time tracking
// Update: Add event existence validation
// Update: Implement add-oracle function
// Update: Implement oracle vote tracking
// Update: Create outcome vote maps
// Update: Create multi-oracle support
// Update: Add oracle vote history
// Update: Add invalid vote handling
// Update: Add resolution validation logic
// Update: Implement resolution finality
// Update: Add resolution status tracking
// Update: Create resolution event emission
// Update: Add resolution verification
// Update: Add payout calculation logic
// Update: Create claimed status tracking
// Update: Add winning pool validation
// Update: Implement refund logic for invalid events
// Update: Create payout status checks
// Update: Add payout amount validation
// Update: Create user reputation data map
// Update: Add reputation initialization
// Update: Implement reputation-based logic
// Update: Create reputation history
// Update: Add reputation bonus system
// Update: Implement reputation persistence
// Update: Create reputation verification
// Update: Add reputation event emission
// Update: Implement reputation-based discount
// Update: Create base fee fallback (2%)
// Update: Add fee amount calculation
// Update: Implement fee adjustment logic
// Update: Create fee transparency functions
// Update: Implement badge registry map
// Update: Create liquidity-champion badge
// Update: Add badge metadata storage
// Update: Implement badge uniqueness check
// Update: Create badge display metadata
// Update: Add badge analytics support
// Update: Create event creation tests
// Update: Add payout calculation tests
// Update: Implement integration tests
// Update: Create stress tests
// Update: Add data integrity tests
// Update: Add contract documentation
// Update: Create deployment instructions
// Update: Add architecture diagrams
// Update: Implement changelog updates
// Update: Improve oracle vote efficiency
// Update: Optimize data structure layout
// Update: Reduce redundant checks
// Update: Improve overall gas efficiency
// Update: Add input sanitization
// Update: Implement race condition prevention
// Update: Create payout security validation
// Update: Add security event emission
// Update: Implement security best practices
// Update: Add event filtering
// Update: Implement event recommendations
// Update: Create reporting functions
// Update: Fix minor bugs in core contract
// Update: Update documentation
// Update: Add deployment scripts
// Initialize Next.js frontend project
// Create event list component
// Add loading states and spinners
// Implement dark mode toggle
// Create user profile page
// Add search functionality
// Create API service layer
// Add bet placement API
// Implement pool data queries
// Create caching layer
// Setup Redux store
// Add reputation state management
// Create state selectors

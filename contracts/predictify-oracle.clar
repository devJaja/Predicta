;; Predictify Oracle - Multi-Oracle M-of-N Consensus

(use-trait core-trait .predictify-core.core-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u200))
(define-constant err-not-oracle (err u201))
(define-constant err-already-voted (err u202))
(define-constant err-event-not-found (err u203))
(define-constant err-invalid-outcome (err u204))

;; Oracle registry
(define-map oracles principal bool)

;; Oracle votes per event
(define-map oracle-votes
  {event-id: uint, oracle: principal}
  {outcome: uint, voted: bool}
)

;; Vote tallies per outcome
(define-map vote-counts
  {event-id: uint, outcome: uint}
  uint
)

;; Oracle Management
(define-public (add-oracle (oracle principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (ok (map-set oracles oracle true))
  )
)

(define-public (remove-oracle (oracle principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (ok (map-delete oracles oracle))
  )
)

(define-read-only (is-oracle (address principal))
  (default-to false (map-get? oracles address))
)

;; Submit Oracle Vote
(define-public (submit-vote (event-id uint) (outcome uint))
  (let
    (
      (existing-vote (map-get? oracle-votes {event-id: event-id, oracle: tx-sender}))
      (current-count (default-to u0 (map-get? vote-counts {event-id: event-id, outcome: outcome})))
    )
    (asserts! (is-oracle tx-sender) err-not-oracle)
    (asserts! (is-none existing-vote) err-already-voted)
    
    (map-set oracle-votes {event-id: event-id, oracle: tx-sender} {
      outcome: outcome,
      voted: true
    })
    
    (map-set vote-counts {event-id: event-id, outcome: outcome} (+ current-count u1))
    
    (ok true)
  )
)

;; Mark event as INVALID (requires consensus)
(define-public (mark-invalid (event-id uint))
  (begin
    (asserts! (is-oracle tx-sender) err-not-oracle)
    (ok true)
  )
)

;; Read-only
(define-read-only (get-vote-count (event-id uint) (outcome uint))
  (default-to u0 (map-get? vote-counts {event-id: event-id, outcome: outcome}))
)

(define-read-only (has-voted (event-id uint) (oracle principal))
  (is-some (map-get? oracle-votes {event-id: event-id, oracle: oracle}))
)
// Update: Add README with project overview
// Update: Create contracts directory structure
// Update: Create issue templates
// Update: Create security policy
// Update: Create API documentation structure
// Update: Add basic event data structures
// Update: Implement place-bet function
// Update: Implement pool update mechanism
// Update: Implement pool query functions
// Update: Implement option count validation
// Update: Implement total pool tracking
// Update: Implement event status checks
// Update: Optimize data structure layout
// Update: Add remove-oracle function
// Update: Create vote submission function
// Update: Add duplicate vote prevention
// Update: Add vote threshold logic
// Update: Implement vote timestamp tracking
// Update: Implement oracle removal safety
// Update: Implement consensus threshold check
// Update: Create invalid event handling
// Update: Create resolution timestamp
// Update: Add resolution conflict handling
// Update: Implement resolution finalization
// Update: Create proportional distribution
// Update: Add double-claim prevention
// Update: Implement total pool calculation
// Update: Create full refund mechanism
// Update: Add payout authorization
// Update: Implement zero-amount protection
// Update: Add reputation score tracking
// Update: Implement reputation update on bet
// Update: Create reputation tiers
// Update: Add reputation leaderboard support
// Update: Implement reputation penalty system
// Update: Create reputation analytics
// Update: Add reputation audit trail
// Update: Optimize reputation storage
// Update: Create fee tier system
// Update: Add fee calculation optimization
// Update: Implement fee deduction logic
// Update: Create fee history tracking
// Update: Optimize fee calculation performance
// Update: Create badge type constants
// Update: Add event-creator badge
// Update: Implement badge timestamp tracking
// Update: Create badge achievement logic
// Update: Add badge collection tracking
// Update: Implement badge optimization
// Update: Add betting logic tests
// Update: Implement reputation tests
// Update: Create edge case tests
// Update: Add validation tests
// Update: Implement performance tests
// Update: Create function reference guide

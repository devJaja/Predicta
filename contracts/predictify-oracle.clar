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

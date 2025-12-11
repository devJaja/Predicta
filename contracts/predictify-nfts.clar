;; Predictify NFT Badges - Non-Transferable Achievement System

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u400))
(define-constant err-already-owns (err u401))

;; Badge types
(define-constant badge-top-predictor u1)
(define-constant badge-win-streak-10 u2)
(define-constant badge-liquidity-champion u3)
(define-constant badge-event-creator u4)

;; Non-transferable NFT badges
(define-map user-badges
  {user: principal, badge-id: uint}
  {earned-at: uint, metadata: (string-ascii 256)}
)

;; Mint badge (admin or automated trigger)
(define-public (mint-badge (user principal) (badge-id uint) (metadata (string-ascii 256)))
  (let
    (
      (existing (map-get? user-badges {user: user, badge-id: badge-id}))
    )
    (asserts! (is-none existing) err-already-owns)
    
    (map-set user-badges {user: user, badge-id: badge-id} {
      earned-at: block-height,
      metadata: metadata
    })
    
    (ok true)
  )
)

;; Check if user owns badge
(define-read-only (has-badge (user principal) (badge-id uint))
  (is-some (map-get? user-badges {user: user, badge-id: badge-id}))
)

;; Get badge details
(define-read-only (get-badge (user principal) (badge-id uint))
  (map-get? user-badges {user: user, badge-id: badge-id})
)
// Update: Initialize Clarinet.toml configuration
// Update: Setup development environment config
// Update: Setup CI/CD workflow skeleton
// Update: Setup project roadmap
// Update: Setup testing framework config
// Update: Add event validation logic
// Update: Create user bet tracking system
// Update: Create event query functions
// Update: Create event nonce counter
// Update: Create duplicate bet prevention
// Update: Create event title storage
// Update: Create read-only helper functions
// Update: Add oracle registry map

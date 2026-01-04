# Align Architecture

## Overview

Align is a client-side React application for AI-assisted sprint planning. All AI behaviors are deterministic via seeded pseudo-random number generation, enabling consistent outputs for testing and demonstration.

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   React      │  │   Framer     │  │   React Router       │   │
│  │   Components │  │   Motion     │  │   (Client Routing)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│           │                                      │               │
│           v                                      v               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   SprintContext                          │    │
│  │  (Global State: strategy, candidates, refinements)       │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                              │                       │
│           v                              v                       │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐   │
│  │   AI Utilities      │  │   localStorage                   │   │
│  │  - selectCandidates │  │  - Draft strategies              │   │
│  │  - refineTicket     │  │  - Refined tickets               │   │
│  │  - seededRandom     │  │  - Sprint history                │   │
│  └─────────────────────┘  └─────────────────────────────────┘   │
│           │                                                      │
│           v                                                      │
│  ┌─────────────────────┐                                        │
│  │   Mock Data         │                                        │
│  │   (backlog.json)    │                                        │
│  └─────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Strategy Input → Candidate Selection

```
User Input (Strategy Text)
    │
    v
┌─────────────────────────────────┐
│  selectCandidates()             │
│  - Extract keywords             │
│  - Score each ticket            │
│  - Apply priority weighting     │
│  - Respect capacity constraints │
│  - Separate tech debt           │
└─────────────────────────────────┘
    │
    v
{ selected: [...], backups: [...], summary: {...} }
```

### 2. Ticket Refinement

```
Selected Ticket
    │
    v
┌─────────────────────────────────┐
│  refineTicket()                 │
│  - Analyze title clarity        │
│  - Check description completeness│
│  - Generate acceptance criteria │
│  - Identify risks               │
│  - Calculate confidence scores  │
└─────────────────────────────────┘
    │
    v
{ original, refined, improvements: [...], overallConfidence }
```

## Component Hierarchy

```
App
└── SprintProvider
    └── Router
        ├── LoginPage
        │   ├── ParticleAnimation
        │   └── Login Form
        │
        ├── StrategyPage
        │   ├── Demo Selector
        │   ├── Strategy Textarea
        │   └── Config Panel (Capacity, Mode, Debt)
        │
        ├── WorkspacePage
        │   ├── StepList (Generation Progress)
        │   ├── DonutChart (Strategic Fit)
        │   ├── TicketCard[] (Candidates)
        │   └── TicketModal
        │       └── DiffView
        │
        ├── LaunchPage
        │   ├── Summary Card
        │   ├── Warnings / Confirmation
        │   └── Launch Button
        │
        └── SuccessPage
            ├── Improvement Metric
            ├── Summary Table
            └── CSV Export
```

## Key Algorithms

### Seeded PRNG (Mulberry32)

Used throughout for deterministic randomness:

```javascript
function createSeededRandom(seed) {
  let state = seed;
  return function() {
    state = state + 0x6D2B79F5 | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

### Candidate Scoring

```
Score = Priority Weight
      + (Keyword Matches × 2)
      + (Business Impact × 0.5)
      + (Random Tiebreaker × 0.5)

Priority Weights: high=3, medium=2, low=1
```

### Strategic Fit Calculation

```
Strategic Fit % = (Total Score / Max Possible Score) × 100
                  capped at 95%
```

## State Management

### SprintContext

| State | Type | Description |
|-------|------|-------------|
| strategy | string | User-entered sprint goals |
| capacityPoints | number | Total story points available |
| capacityMode | 'conservative' \| 'aggressive' | Capacity multiplier |
| debtPercent | number | % of capacity for tech debt |
| selectedCandidates | Ticket[] | Chosen sprint tickets |
| backupCandidates | Ticket[] | Reserve tickets |
| summary | Summary | Generation statistics |
| refinedTickets | Record<id, Refinement> | Accepted improvements |

### Persistence

| Key | Data | Auto-save |
|-----|------|-----------|
| align_draft_strategy | Strategy text | On change |
| align_refined_tickets | Ticket refinements | On accept |
| align_current_sprint | Full sprint state | On change |
| align_sprint_history | Past sprints | On launch |

## Performance Optimizations

1. **Particle Animation**
   - Uses GPU-accelerated transforms only
   - Reduces particle count on mobile (20 vs 40)
   - Uses `will-change: transform`

2. **Component Memoization**
   - Refinement calculations use `useMemo`
   - Particle positions cached per seed

3. **Animation Limiting**
   - Respects `prefers-reduced-motion`
   - Framer Motion exit animations are optimized

## Future LLM Integration

When `VITE_MOCK_MODE=false`:

1. Replace `selectCandidates` with API call to LLM
2. Replace `refineTicket` with streaming LLM response
3. Add seed parameter to API for reproducibility
4. Implement caching layer for repeated queries

API contract will match existing function signatures for seamless swap.

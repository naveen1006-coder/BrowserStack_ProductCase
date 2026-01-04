# Align - AI-Powered Sprint Planning

<div align="center">

![Align Logo](https://img.shields.io/badge/Align-AI%20Sprint%20Planning-2B3990?style=for-the-badge&logo=react)

**Intelligent Sprint Planning That Aligns Teams with Strategy**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🎯 Overview

**Align** is an AI-powered sprint planning tool that helps engineering teams create strategically-aligned sprints. It uses intelligent algorithms to select the best tickets from your backlog based on your strategic goals, automatically refines ticket descriptions, and provides real-time analytics on sprint health.

---

## ✨ Key Features

### 1. � Strategic Sprint Planning

**Define Your Strategy → Generate Optimized Sprint**

- **Natural Language Strategy Input**: Describe your sprint goals in plain English (e.g., "Focus on improving Q3 retention by fixing checkout issues and enhancing user onboarding")
- **Demo Strategies**: Quick-start templates for common scenarios (Performance, Security, UX, Retention)
- **Keyboard Shortcut**: Type `demo-coffee` anywhere to auto-fill a sample strategy

### 2. 🤖 AI-Powered Ticket Selection

**Intelligent Candidate Selection Algorithm**

- **Strategy Matching**: Scores each backlog item against your stated strategy
- **Capacity Optimization**: Respects team capacity and utilization targets
- **Tech Debt Balance**: Configurable percentage for tech debt vs. feature work
- **Dependency Awareness**: Considers ticket dependencies and blockers
- **Backup Candidates**: Automatically suggests replacement tickets

### 3. ⚙️ Capacity & Resource Management

**Team Capacity Visualization**

| Feature | Description |
|---------|-------------|
| **Team Overview Bar** | Real-time capacity display with role breakdown |
| **Resource Drawer** | Detailed view of each team member's availability |
| **Deduction Tracking** | PTO, meetings, on-call rotations automatically factored in |
| **Capacity Modes** | Conservative, Moderate, or Aggressive planning styles |
| **Tech Debt Slider** | Allocate 0-30% of capacity to technical debt |

### 4. 🔄 AI Ticket Refinement

**Automatic Ticket Enhancement**

- **Description Improvement**: AI suggests clearer, more actionable descriptions
- **Acceptance Criteria**: Auto-generates missing acceptance criteria
- **Diff View**: Side-by-side comparison of original vs. refined tickets
- **Confidence Scores**: Shows AI confidence level for each suggestion
- **Low-Confidence Warnings**: Flags suggestions that need human review

### 5. 📊 Sprint Workspace

**Interactive Sprint Board**

- **Ticket Cards**: Visual cards with points, priority, labels, and assignees
- **Reject & Replace**: Remove tickets with one click; backups auto-substitute
- **Click to Refine**: Open any ticket for AI refinement suggestions
- **Strategic Fit Score**: Real-time calculation of sprint alignment
- **Capacity Utilization**: Live tracking of points vs. available capacity

### 6. 🚀 Launch Experience

**Sprint Launch with Visual Feedback**

- **Pre-Launch Summary**: Review points, tickets, refinements before launch
- **Risk Acknowledgment**: Checkbox to confirm AI suggestions were reviewed
- **Animated Loading**: Full-screen loading overlay with staged progress:
  - Preparing sprint...
  - Syncing with backlog...
  - Launching sprint...
  - Sprint launched!

### 7. 📈 Active Sprint Board (Success Page)

**Real-Time Sprint Tracking**

| Component | Description |
|-----------|-------------|
| **Progress Bar** | Days remaining, issues completed, velocity |
| **Burndown Chart** | Mini sparkline showing ideal vs. actual progress |
| **Data Grid** | Sortable, draggable table of all sprint tickets |
| **Status Columns** | To Do, In Progress, Review, Done |
| **Team Avatars** | Visual indicator of assigned team members |

**Data Grid Features:**
- ✅ Drag-and-drop reordering
- ✅ Click to change status
- ✅ Assignee dropdown selection
- ✅ AI-refined badge indicators
- ✅ Linked issues display

### 8. 📋 Activity Console

**Live Activity Feed**

- Fixed-position console at bottom of sprint board
- Logs all sprint activities: refinements, status changes, exports
- Clear logs button for fresh view
- Actor tracking (SYSTEM, AI_AGENT, USER)

### 9. 📜 Sprint History

**Historical Sprint Tracking**

- **Timeline View**: Chronological list of past sprints
- **Metrics Comparison**: Points, strategic fit, velocity trends
- **Trend Indicators**: Up/down arrows showing performance changes
- **Expandable Details**: Click to see refined count, completion rate
- **Export to CSV**: Download full history for reporting
- **Clear History**: Reset to demo data

### 10. 📤 Export Capabilities

**Data Export Options**

| Export Type | Format | Contents |
|-------------|--------|----------|
| Sprint Candidates | CSV | Ticket details, points, status, assignees |
| Team Capacity | CSV | Base points, deductions, utilization |
| Sprint History | CSV | Historical metrics and performance |

---

## 🎨 Design System

### Color Palette

| Color | Usage |
|-------|-------|
| **Primary Blue** `#2B3990` | Buttons, links, interactive elements |
| **Emerald** | Success states, AI-refined badges |
| **Amber** | Warnings, caution states |
| **Red** | Danger, errors, delete actions |
| **Neutral Grays** | Text, backgrounds, borders |

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Semibold, neutral-900
- **Body**: Regular, neutral-700
- **Captions**: Small, neutral-500

### Components

Built with **Radix UI** primitives for accessibility:
- Buttons (default, secondary, outline, ghost, danger, success)
- Cards with headers and content sections
- Dialogs/Modals with proper focus management
- Progress bars with animations
- Badges with color variants
- Sliders with tooltips
- Switches and checkboxes
- Select dropdowns

---

## 🔧 Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 with Hooks |
| **Build** | Vite 5 |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **State** | React Context API |
| **Routing** | React Router v6 |
| **Storage** | localStorage for persistence |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base components (button, card, etc.)
│   ├── DonutChart.jsx  # Strategic fit visualization
│   ├── TicketCard.jsx  # Sprint ticket display
│   ├── TicketModal.jsx # AI refinement modal
│   └── ...
├── context/            # React Context providers
│   └── SprintContext.jsx
├── pages/              # Route pages
│   ├── LoginPage.jsx   # Entry point
│   ├── StrategyPage.jsx# Strategy input
│   ├── WorkspacePage.jsx# Ticket selection
│   ├── LaunchPage.jsx  # Sprint launch
│   ├── SuccessPage.jsx # Active sprint board
│   └── SprintHistoryPage.jsx
├── utils/              # Helper functions
│   ├── selectCandidates.js  # Ticket selection algorithm
│   ├── refineTicket.js      # AI refinement logic
│   └── storage.js           # localStorage helpers
├── data/               # Mock data
│   ├── backlog.json    # Sample tickets
│   └── teamRoster.js   # Team capacity data
└── styles/             # Design tokens
```

---

## � Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:5173
```

### Environment Variables

```env
VITE_MOCK_MODE=true   # Use deterministic mock data
```

---

## 📖 User Flow

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   Login     │────▶│   Strategy   │────▶│   Workspace   │
│  (Demo)     │     │    Input     │     │  (Candidates) │
└─────────────┘     └──────────────┘     └───────────────┘
                                                  │
                                                  ▼
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│   History   │◀────│   Success    │◀────│    Launch     │
│  (Sprints)  │     │   (Board)    │     │   (Review)    │
└─────────────┘     └──────────────┘     └───────────────┘
```

---

## � Use Cases

### For Product Managers
- Align engineering work with quarterly OKRs
- Visualize capacity constraints before committing
- Track sprint-over-sprint improvement

### For Engineering Leads
- Balance feature work with tech debt
- See team availability at a glance
- Export data for stakeholder reporting

### For Developers
- Clear, refined ticket descriptions
- Understand sprint priorities
- Drag-and-drop task organization

---

## 📝 License

This project is for demonstration purposes.

---

<div align="center">

**Built with ❤️ using React, Vite, and Tailwind CSS**

</div>

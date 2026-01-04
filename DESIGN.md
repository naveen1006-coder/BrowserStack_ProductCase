# Align Design System

## Overview

Align follows BrowserStack's brand guidelines with a focus on clarity, accessibility, and professional aesthetics. NO glass-morphism is used.

## Color Palette

### Primary - BrowserStack Blue

| Token | Hex | Usage |
|-------|-----|-------|
| primary-50 | #EEF0F9 | Hover backgrounds |
| primary-100 | #D4D9F0 | Selected states |
| primary-200 | #A9B3E1 | Borders, accents |
| primary-500 | **#2B3990** | Main brand color |
| primary-600 | #232E73 | Hover states |
| primary-700 | #1A2256 | Active states |
| primary-900 | #090B1C | Dark backgrounds |

### Semantic Colors

| Purpose | Color | Hex |
|---------|-------|-----|
| Success | Green | #10B981 |
| Warning | Amber | #F59E0B |
| Danger | Red | #EF4444 |
| Neutral | Gray | #71717A |

### Usage Guidelines

```html
<!-- Primary actions -->
<button class="bg-primary-500 hover:bg-primary-600">
  Generate Sprint
</button>

<!-- Success states -->
<div class="bg-success-50 text-success-600 border-success-200">
  ✓ Ticket refined
</div>

<!-- Warning states -->
<div class="bg-warning-50 text-warning-600">
  ⚠ Review recommended
</div>
```

## Typography

### Font Family

**Inter** - Modern, highly legible sans-serif

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Scale

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| text-xs | 12px | 1.5 | Badges, hints |
| text-sm | 14px | 1.5 | Body text, labels |
| text-base | 16px | 1.5 | Default body |
| text-lg | 18px | 1.5 | Subheadings |
| text-xl | 20px | 1.25 | Section titles |
| text-2xl | 24px | 1.25 | Page titles |
| text-3xl | 30px | 1.25 | Hero text |

### Weights

| Weight | Class | Usage |
|--------|-------|-------|
| 400 | font-normal | Body text |
| 500 | font-medium | Labels, emphasis |
| 600 | font-semibold | Headings |
| 700 | font-bold | Primary headings |

## Spacing

Based on 4px grid:

| Token | Value | Common usage |
|-------|-------|--------------|
| 1 | 4px | Inline spacing |
| 2 | 8px | Icon gaps |
| 3 | 12px | Tight padding |
| 4 | 16px | Default padding |
| 6 | 24px | Section spacing |
| 8 | 32px | Large gaps |

## Components

### Buttons

```html
<!-- Primary -->
<button class="bg-primary-500 text-white hover:bg-primary-600 
               px-4 py-2.5 rounded-lg font-medium">
  Primary Action
</button>

<!-- Secondary -->
<button class="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 
               px-4 py-2.5 rounded-lg font-medium">
  Secondary
</button>

<!-- Outline -->
<button class="border-2 border-primary-500 text-primary-500 
               hover:bg-primary-50 px-4 py-2.5 rounded-lg font-medium">
  Outline
</button>

<!-- Danger -->
<button class="bg-danger-500 text-white hover:bg-danger-600 
               px-4 py-2.5 rounded-lg font-medium">
  Delete
</button>
```

### Cards

```html
<div class="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
  <h3 class="text-lg font-semibold text-neutral-900">Card Title</h3>
  <p class="text-neutral-500 mt-2">Card content goes here.</p>
</div>
```

### Inputs

```html
<label class="block text-sm font-medium text-neutral-700 mb-1.5">
  Email
</label>
<input type="email" 
       class="w-full px-3 py-2.5 border border-neutral-300 rounded-lg 
              focus:border-primary-500 focus:ring-2 focus:ring-primary-100
              placeholder:text-neutral-400" 
       placeholder="you@example.com">
```

### Badges

```html
<!-- Default -->
<span class="px-2.5 py-0.5 text-xs font-medium rounded-full 
             bg-primary-100 text-primary-700">
  Default
</span>

<!-- Priority badges -->
<span class="px-2.5 py-0.5 text-xs font-medium rounded-full 
             bg-danger-50 text-danger-600 border border-danger-200">
  High
</span>
```

## Accessibility

### Focus States

All interactive elements have visible focus rings:

```css
*:focus-visible {
  outline: none;
  ring: 2px solid #2B3990;
  ring-offset: 2px;
}
```

### Skip Link

```html
<a href="#main-content" class="skip-to-content">
  Skip to content
</a>
```

### ARIA Labels

```html
<button aria-label="Reject ticket ALIGN-001">
  <XIcon />
</button>

<div role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  75%
</div>
```

### Color Contrast

All text meets WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

## Animation

### Principles

1. **Purpose**: Animations communicate state changes, not decoration
2. **Performance**: GPU-accelerated transforms only
3. **Accessibility**: Respect `prefers-reduced-motion`

### Timing

| Type | Duration | Easing |
|------|----------|--------|
| Micro | 150ms | ease |
| Standard | 200ms | ease |
| Complex | 300ms | ease-out |
| Page | 400-500ms | ease-out |

### Particle Animation

- Desktop: 40 particles
- Mobile (<640px): 20 particles
- Snap interval: 3 seconds
- Uses `will-change: transform`

### Card Fly-out

```javascript
exit={{ 
  opacity: 0, 
  x: 200, 
  rotate: 10,
  transition: { duration: 0.4, ease: "easeIn" }
}}
```

## Wireframes (ASCII)

### Login Page

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ┌────────────────┐  ┌────────────────────────┐  │
│  │                │  │                        │  │
│  │   [Logo]       │  │    • •   •  •          │  │
│  │   Align        │  │      •  •    •         │  │
│  │                │  │   •       •   •        │  │
│  │   ┌──────────┐ │  │      •  •    •         │  │
│  │   │ Email    │ │  │   Particle Animation   │  │
│  │   └──────────┘ │  │                        │  │
│  │   ┌──────────┐ │  │                        │  │
│  │   │ Password │ │  │                        │  │
│  │   └──────────┘ │  │                        │  │
│  │                │  │                        │  │
│  │   [Sign In]    │  │                        │  │
│  │   [Demo Login] │  │                        │  │
│  │                │  │                        │  │
│  └────────────────┘  └────────────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Strategy Page

```
┌──────────────────────────────────────────────────┐
│  [←] Align                Strategy Command Center│
├──────────────────────────────────────────────────┤
│                                                  │
│  Define Your Sprint Strategy                     │
│                                                  │
│  ┌────────────────────────┐  ┌────────────────┐  │
│  │ Demo Strategy Picker   │  │ Capacity: [20] │  │
│  │ [Select...]       ▼    │  │                │  │
│  └────────────────────────┘  │ Mode: ○ Cons.  │  │
│                              │       ● Aggr.  │  │
│  ┌────────────────────────┐  │                │  │
│  │                        │  │ Tech Debt:     │  │
│  │ Sprint Strategy        │  │ ───●────── 10% │  │
│  │ text area...           │  │                │  │
│  │                        │  │                │  │
│  │                        │  │ [Generate →]   │  │
│  └────────────────────────┘  └────────────────┘  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Workspace Page

```
┌──────────────────────────────────────────────────┐
│  [←] Align           [Regenerate] [→ Launch]     │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────┐  ┌───────────────────────────┐   │
│  │            │  │ Proposed Sprint Candidates │   │
│  │    75%     │  │                           │   │
│  │  ╭─────╮   │  │ ┌───────────────────────┐ │   │
│  │  │     │   │  │ │ ALIGN-001 [High] [×]  │ │   │
│  │  ╰─────╯   │  │ │ Fix session timeout   │ │   │
│  │ Strategic  │  │ │ 5 pts • 85% conf      │ │   │
│  │    Fit     │  │ └───────────────────────┘ │   │
│  │            │  │                           │   │
│  │ Total: 18  │  │ ┌───────────────────────┐ │   │
│  │ Feature:14 │  │ │ ALIGN-002 [High]      │ │   │
│  │ Debt: 4    │  │ │ Retry logic           │ │   │
│  │            │  │ │ 3 pts • 91% conf      │ │   │
│  └────────────┘  │ └───────────────────────┘ │   │
│                  │           ...             │   │
│                  └───────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Ticket Modal

```
┌───────────────────────────────────────────────────┐
│  ALIGN-001                                    [×] │
│  Fix user session timeout handling                │
│  AI-suggested improvements                        │
├───────────────────────────────────────────────────┤
│  ⚡ Overall Confidence: 85%                       │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ title • clarity                    88% conf │  │
│  ├─────────────────────────────────────────────┤  │
│  │ Before          │ After                     │  │
│  │ Fix user ses... │ Fix: fix user session... │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ acceptanceCriteria • addition      82% conf │  │
│  ├─────────────────────────────────────────────┤  │
│  │ Before          │ After                     │  │
│  │ (not defined)   │ - [ ] Bug resolved...    │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│                      [Cancel]  [✓ Accept]         │
└───────────────────────────────────────────────────┘
```

## Resources

- [BrowserStack Brand Guidelines](https://browserstack.com/brand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Components](https://radix-ui.com)
- [Framer Motion](https://framer.com/motion)

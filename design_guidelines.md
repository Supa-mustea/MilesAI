# MilesAI Design Guidelines

## Design Approach

**Hybrid Design System**: Dual-personality interface requiring distinct visual modes while maintaining cohesive brand identity.

**Primary Reference**: Material Design 3 principles for foundation, with heavy customization for two distinct operational modes:
- **Therapy Mode**: Inspired by Calm, Headspace (wellness apps) + BetterHelp (professional therapy platforms)
- **HacxGPT Mode**: Inspired by Linear, GitHub dark themes, terminal aesthetics, cyberpunk interfaces

**Justification**: This is a data-heavy application requiring robust component patterns (Material Design strength) but with dual personalities demanding dramatic visual distinction between therapeutic and unrestricted AI modes.

---

## Core Design Elements

### A. Color Palette

**Therapy Mode (Primary)**
- Primary: 200 45% 65% (Calming teal)
- Secondary: 280 35% 70% (Soft lavender)
- Success: 140 50% 55% (Growth green)
- Background: 220 15% 12% (Deep navy-charcoal)
- Surface: 220 12% 18% (Elevated charcoal)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

**HacxGPT Mode (Alternate)**
- Primary: 180 100% 50% (Cyan - matrix/terminal aesthetic)
- Accent: 330 85% 60% (Hot pink - cyberpunk)
- Warning: 45 95% 60% (Amber alerts)
- Background: 0 0% 8% (True dark)
- Surface: 0 0% 12% (Terminal black)
- Text Primary: 180 100% 85% (Cyan-tinted)
- Text Secondary: 0 0% 60%

**Shared/Neutral**
- Error: 0 70% 60%
- Chart colors: Use vibrant but distinct hues (120, 200, 280, 40, 320) at 60% saturation, 55% lightness

### B. Typography

**Font Families**
- Headers/UI: Inter (Google Fonts) - clean, professional, excellent readability
- Body/Chat: System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- Code/Terminal (HacxGPT): JetBrains Mono (Google Fonts) - monospace for terminal aesthetic

**Type Scale**
- H1: 2.5rem / 700 weight / -0.02em tracking
- H2: 2rem / 600 weight / -0.01em tracking
- H3: 1.5rem / 600 weight / normal tracking
- Body Large: 1.125rem / 400 weight / 0.01em tracking
- Body: 1rem / 400 weight / normal tracking
- Caption: 0.875rem / 500 weight / 0.02em tracking
- Code: 0.9375rem / 400 weight / JetBrains Mono

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Micro spacing: p-2, gap-2 (buttons, tight elements)
- Standard spacing: p-4, gap-4, m-6 (cards, sections)
- Section spacing: py-8, py-12 (major divisions)
- Page margins: px-6 md:px-12, max-w-7xl

**Grid System**
- Main layout: 2-column on desktop (sidebar + main content)
- Sidebar: Fixed 280px on lg+, collapsible drawer on mobile
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Opportunity cards: grid-cols-1 lg:grid-cols-2

### D. Component Library

**Navigation**
- Persistent sidebar (desktop) with mode switcher at top
- Mode toggle: Large, prominent button switching between Therapy/HacxGPT
- Visual mode indicator: Icon + background color shift
- Collapsible mobile navigation drawer

**Chat Interface**
- Message bubbles: User (right-aligned, primary color bg), AI (left-aligned, surface bg)
- Therapy mode: Rounded corners (rounded-2xl), soft shadows
- HacxGPT mode: Sharp corners (rounded-md), terminal-style borders
- Rich markdown rendering with syntax highlighting (using highlight.js, monokai theme)
- Typing indicators: Animated dots in therapy mode, blinking cursor in HacxGPT mode

**Dashboard Cards**
- Elevated surfaces: bg-surface with subtle border
- Header with icon + title + action button
- Content area with appropriate data visualization
- Therapy cards: Soft shadows, rounded-2xl
- HacxGPT cards: Hard shadows, rounded-lg, subtle cyan border glow

**Data Visualization**
- Mood tracking: Line charts with gradient fills (Chart.js or Recharts)
- Stress levels: Horizontal bar charts with color-coded zones (green/yellow/red)
- Opportunity metrics: Progress circles showing confidence scores
- Session timeline: Vertical timeline with mood indicators

**Forms & Inputs**
- Therapy mode: Rounded inputs (rounded-xl), soft focus rings
- HacxGPT mode: Angular inputs (rounded-md), cyan focus glow
- Labels: Positioned above inputs, caption size, medium weight
- Validation: Inline error messages below fields

**Buttons**
- Primary: Full color fill, medium shadow, hover lift
- Secondary: Outline style with 2px border, transparent bg
- Therapy mode: rounded-full, soft transitions
- HacxGPT mode: rounded-md, sharp transitions, terminal-style hover effects

**Modal Overlays**
- Backdrop: backdrop-blur-sm bg-black/50
- Modal surface: Centered, max-w-2xl, appropriate mode styling
- Close button: Top-right, hover state prominent

### E. Mode-Specific Treatments

**Therapy Mode Characteristics**
- Border radius: Generous (rounded-2xl for cards, rounded-full for buttons)
- Shadows: Soft, diffused (shadow-lg with lower opacity)
- Transitions: Slower, eased (duration-300 ease-out)
- Icons: Rounded, friendly (Heroicons rounded variant)
- Background patterns: Subtle gradient overlays

**HacxGPT Mode Characteristics**
- Border radius: Minimal (rounded-md for cards, rounded-lg for buttons)
- Borders: Visible 1px borders with cyan/pink accents
- Shadows: Hard, directional (shadow-xl with higher opacity, cyan tint)
- Transitions: Snappy (duration-150 ease-in)
- Icons: Sharp, technical (Heroicons outline variant)
- Background patterns: Terminal scan lines (subtle), matrix-style grid

**Mode Transition**
- Smooth crossfade between color schemes (duration-500)
- Layout shifts minimal - only accent colors and corner radii change
- Preserve scroll position and content during switch

---

## Images

**Hero Section**: Not applicable - this is a chat/dashboard application, not a marketing page.

**Profile Avatar Placeholders**: User profile section uses circular avatar images (128px). Use gradient placeholders initially with user initials.

**Opportunity Cards**: Include small illustrative icons (64px) for opportunity types (briefcase for jobs, coin for crypto, rocket for business ideas).

**Therapy Session Icons**: Emotion indicators using icon library (smile, meh, frown) with color coding.

**Background Decorative**: Therapy mode uses subtle abstract gradient blobs in background (low opacity, blur-3xl). HacxGPT mode uses CSS-generated grid pattern.

---

## Accessibility & Dark Mode

- Dark mode is default and primary design
- Light mode not required per user preference
- All form inputs maintain dark backgrounds with light text
- Color contrast ratios: Minimum 4.5:1 for body text, 3:1 for large text
- Focus indicators: 3px ring in appropriate mode color
- Keyboard navigation: Full support with visible focus states

---

## Animation Guidelines

**Minimal, Purposeful Animations**
- Page transitions: None (instant navigation)
- Chat message entry: Slide-up fade-in (duration-200)
- Typing indicator: Pulsing dots or blinking cursor
- Data updates: Number count-up animations (duration-1000)
- Mode switch: Color crossfade only (duration-500)
- Avoid: Scroll-triggered animations, decorative motion, parallax effects
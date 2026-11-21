---
name: Clinical Precision HIG
colors:
  surface: '#faf8fe'
  surface-dim: '#dad9df'
  surface-bright: '#faf8fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf3'
  surface-container-high: '#e9e7ed'
  surface-container-highest: '#e3e2e7'
  on-surface: '#1a1b1f'
  on-surface-variant: '#414753'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#717785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005cbb'
  primary: '#0059b5'
  on-primary: '#ffffff'
  primary-container: '#0071e3'
  on-primary-container: '#fcfbff'
  inverse-primary: '#abc7ff'
  secondary: '#006e28'
  on-secondary: '#ffffff'
  secondary-container: '#6ffb85'
  on-secondary-container: '#00732a'
  tertiary: '#8a2ab9'
  on-tertiary: '#ffffff'
  tertiary-container: '#a548d4'
  on-tertiary-container: '#fffafa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#00458f'
  secondary-fixed: '#72fe88'
  secondary-fixed-dim: '#53e16f'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#f6d9ff'
  tertiary-fixed-dim: '#e8b3ff'
  on-tertiary-fixed: '#310048'
  on-tertiary-fixed-variant: '#7201a2'
  background: '#faf8fe'
  on-background: '#1a1b1f'
  surface-variant: '#e3e2e7'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 41px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 25px
  title-sm:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 13px
  mono-metric:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for critical, zero-error emergency hospital environments and fast-paced nursing stations. Drawing direct architectural lineage from Apple’s Human Interface Guidelines (macOS and iPadOS), the interface balances institutional authority with high-speed ergonomic clarity. 

The aesthetic philosophy centers on **Clinical Translucency and Structured Calm**:
- **Cognitive Demarcation**: Under acute cognitive load, medical professionals must parse dosage schedules, allergies, and drug interactions within fractions of a second. Extraneous decorative elements are eliminated in favor of spatial purity, optical balancing, and strict semantic color anchors.
- **Apple HIG Adaptation**: Utilizes frosted materials (`materials` / `vibrancy`), micro-borders with high edge-contrast, gentle depth through layered translucency, and tactile touch targets tuned for iPadOS carts and wall-mounted touch displays.
- **Safety-First Ergonomics**: Critical medication verification patterns demand deliberate gesture mechanics and high-contrast typography conforming rigorously to WCAG AAA standards.

## Colors

The palette establishes an authoritative, calm baseline punctuated by strict, unambiguous pharmacological safety signals.

### Core Foundation
- **Primary (`#0071E3`)**: Apple Clinical Blue. Used for definitive user actions, primary confirmations, active tabs, and non-threatening selection states. In dark mode, this lifts to `#0A84FF`.
- **Canvas Base (`#F5F5F7`)**: Pristine clinical neutral canvas that minimizes screen glare under harsh fluorescent hospital lighting. Dark mode canvas resolves to `#000000` / `#1C1C1E`.
- **Surface Elevation (`#FFFFFF` with variable opacity)**: Multi-tier frosted glass surfaces sitting above the background canvas.

### Pharmacological & Safety Status Tokens
The system enforces strict color semantics that must never be repurposed for generic styling:
- **Critical Contraindication / Allergy Alert (`#FF3B30`)**: Pure critical red. Reserved exclusively for anaphylaxis risks, incompatible drug-to-drug interactions, lethal dosage ceilings, and hard-stop medical overrides.
- **Imminent / Schedule Warning (`#FF9500`)**: Deep clinical amber. Signals upcoming doses (within 15 minutes), approaching expiration dates, and titration warnings requiring dual-nurse sign-off.
- **Verified / Administered (`#34C759`)**: Emerald green. Applied strictly to successfully logged administrations, normal vital ranges, and validated five-rights checks.
- **Controlled Substances & High-Risk (`#AF52DE`)**: Deep clinical purple. Identifies opioids, sedatives, insulin regimens, and dual-authorization controlled substances.
- **Infusion / IV Fluids & Diluents (`#32ADE6`)**: Clinical cyan. Standardized marker for continuous IV drips, carrier solutions, and fluid balance indicators.

### Edge Contrast
All card surfaces and floating panels feature a strict `1px` inner or outer border (`rgba(0, 0, 0, 0.08)` in light mode, `rgba(255, 255, 255, 0.15)` in dark mode) ensuring crisp physical demarcation in high-glare environments.

## Typography

Typography relies on **Inter** with native OpenType features configured for maximum clinical legibility: tabular numbers (`tnum`), slashed zeros (`zero`), and contextual alternates are activated globally.

### Typographic Rules for Medical Safety
- **Tallman Lettering & Dosage Clarification**: Drug titles must allow capitalization of distinctive syllables (e.g., `vinBLAStine` vs. `vinCRIStine`) without artificial CSS transforms (`text-transform: none` is enforced globally).
- **Tabular Figures for Metrics**: All numerical dosages, blood pressures, heart rates, infusion rates (mL/h), and countdown timers must use tabular lining figures to ensure vertical decimal alignment across multi-patient tables.
- **Scale Hierarchy**: Large titles provide situational awareness from standing distances (1.5–2 meters from cart displays), while standard 15px/17px body copy ensures fatigue-free prolonged chart reading.

## Layout & Spacing

The layout philosophy mirrors iPadOS and macOS multi-pane structures: Split View and Stage Manager architectural layouts that keep vital patient context pinned while manipulating medication schedules.

### Structural Framework
- **Primary Layout Engine**: Fluid CSS Grid combined with persistent sidebar navigation (width: `280px` desktop / collapsible sheet on tablet/mobile).
- **Touch-Target Safeguard**: In mobile and iPad configurations, all actionable touch points maintain a minimum boundary box of `44x44pt` (`48px` on workstation displays) to prevent accidental taps when nurses are wearing surgical gloves.
- **Breakpoints**:
  - `Compact (0 - 767px)`: Single-column flow with persistent top triage bar and fixed bottom emergency confirmation drawer.
  - `Medium / iPad Portrait (768px - 1024px)`: Two-pane split: Patient Vitals/Allergies banner fixed at top, side-by-side MAR (Medication Administration Record) schedule.
  - `Expanded / Workstation (1025px+)`: Three-pane command center: Patient Navigation Panel (`280px`), Active MAR Grid (`flexible`), and Drug Interaction Inspector (`360px`).

## Elevation & Depth

Visual hierarchy adopts Apple HIG **Materials and Vibrancy** rather than opaque drop shadows. Surfaces communicate z-index depth through translucent frosted layers and refined ambient diffusion.

### Depth Hierarchy
1. **Background Layer (`Level 0`)**: Solid canvas `#F5F5F7`.
2. **Standard Clinical Card (`Level 1`)**: White fill at `88%` to `94%` opacity, paired with `backdrop-filter: blur(20px)` and a subtle `1px` border of `rgba(0, 0, 0, 0.06)`. Diffused shadow: `0 2px 8px rgba(0, 0, 0, 0.04)`.
3. **Elevated Floating Drawers / Modals (`Level 2`)**: White fill at `95%` opacity, `backdrop-filter: blur(30px)`, border `rgba(0, 0, 0, 0.08)`, shadow: `0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)`.
4. **Emergency Interruption Modal (`Level 3`)**: Semi-opaque backdrop overlay (`rgba(0, 0, 0, 0.35)` with `backdrop-filter: blur(8px)`). Modal container floats centered with an unmistakable high-contrast critical edge (`border: 2px solid #FF3B30`).

## Shapes

In harmony with contemporary Apple hardware and fluid touch ergonomics, the design system utilizes generous continuous curvature (squircle-inspired radii):
- **Base Cards & Medication Modules**: `18px` to `24px` (`rounded-xl` equivalent). This smooth rounding eliminates sharp visual noise, guiding the eye into the center of clinical data blocks.
- **Interactive Controls (Buttons, Inputs)**: `10px` to `12px` border radius, ensuring a consistent relationship inside larger cards.
- **Status Pills & Pharmacological Chips**: Fully rounded pill shapes (`9999px`) to distinguish categorical metadata from interactive container cards.

## Components

### Buttons & Action Controls
- **Primary Safety Action ("Confirm Administration")**: Solid `#0071E3` fill, white typography, `12px` roundedness, minimum height `48px`. Hover produces subtle brightness reduction (10%), active state triggers a scale depression to `98%` replicating native iOS tactile feedback.
- **Destructive / Override Action**: Solid `#FF3B30` fill with secondary authentication confirmation step required.
- **Secondary Actions**: Frosted translucent fill (`rgba(0, 113, 227, 0.08)`), text `#0071E3`, zero outline.

### Medication Cards (The Core MAR Component)
- **Container**: Translucent white card (`20px` radius, `1px` subtle rim border).
- **Status Edge**: `4px` left vertical accent strip conveying state: Red (Contraindication), Amber (Pending/Due Now), Green (Administered), Gray (Held/Discontinued).
- **Layout**: Top row houses the medication name in Tallman formatting with dosage and route; bottom row houses time countdown, barcode verification indicator, and double-sign nurse badge.

### Safety Chips & Badges
- **Dosage Chips**: Pill-shaped, semi-transparent backgrounds with high-saturation foreground text (e.g., `#FF3B30` text over `rgba(255, 59, 48, 0.12)` background).
- **Allergy Banner**: High-priority alert banner with an integrated warning icon, solid red left indicator, and bold typography.

### Checkboxes & Verification Toggles
- Custom Apple-style rounded checkboxes (`6px` radius) and fluid switch toggles (`51x31px` HIG proportions).
- When toggling high-risk checks (e.g., "Patient Identity Confirmed via Wristband Barcode"), the control transitions from neutral gray to vivid `#34C759` with a subtle haptic feedback cue.

### Inputs & Dosage Steppers
- Clean recessed containers with a background of `rgba(0, 0, 0, 0.03)` in light mode, surrounded by a 1px border.
- On focus: smooth outer ring transition using `0 0 0 3px rgba(0, 113, 227, 0.35)`.
- Steppers feature dedicated, oversized `+` and `–` tap targets specifically calibrated for quick dose titrations on bedside tablets.
---
name: Blueprint Wireframe
colors:
  surface: '#f7f9fd'
  surface-dim: '#d8dade'
  surface-bright: '#f7f9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f8'
  surface-container: '#eceef2'
  surface-container-high: '#e6e8ec'
  surface-container-highest: '#e0e2e6'
  on-surface: '#191c1f'
  on-surface-variant: '#424754'
  inverse-surface: '#2d3134'
  inverse-on-surface: '#eff1f5'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#dee0e2'
  on-secondary-container: '#606365'
  tertiary: '#b61722'
  on-tertiary: '#ffffff'
  tertiary-container: '#da3437'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e2e4'
  secondary-fixed-dim: '#c5c6c8'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#f7f9fd'
  on-background: '#191c1f'
  surface-variant: '#e0e2e6'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-padding: 16px
  stack-gap-sm: 8px
  stack-gap-md: 12px
  stack-gap-lg: 20px
  inline-gutter: 12px
  safe-area-bottom: 34px
---

## Brand & Style
This design system focuses on structural clarity and functional hierarchy for a mobile task management environment. The aesthetic is rooted in **Minimalism** and **Low-Fidelity** principles, stripping away decorative distractions to prioritize content organization and user flow. 

The target audience consists of product managers and developers who need a clear, un-styled canvas to validate features. The UI should evoke a sense of "work-in-progress" precision—clean, intentional, and balanced. By using high-contrast borders and a restricted color palette, the interface directs focus entirely toward task completion and information architecture.

## Colors
The palette is functional rather than expressive. 
- **Primary Blue (#3B82F6):** Reserved exclusively for primary actions and active states (e.g., "Add Task" or selected filters).
- **Danger Red (#EF4444):** Used for destructive actions such as "Delete" or "Clear All."
- **App Background (#F3F4F6):** Provides a slight contrast against the white component surfaces to define the mobile viewport boundaries.
- **Border Gray (#E5E7EB):** The fundamental building block for structure, used for dividers, input outlines, and card strokes.
- **Typography:** Deep slate for primary readability and medium gray for secondary metadata.

## Typography
The system utilizes **Inter** to maintain a neutral, systematic appearance. For the Chinese implementation, ensure the font falls back to system defaults (PingFang SC) while maintaining the weight and scale defined.

- **Headlines:** Used for page titles (e.g., "今日待办") and modal headers.
- **Body:** Standardized for task descriptions and input text. 
- **Labels:** Used for status indicators, timestamps, and button text.
- **Scaling:** On mobile, title sizes are slightly reduced to ensure longer task strings do not wrap aggressively.

## Layout & Spacing
The layout follows a **Fluid Grid** within a fixed mobile container. 
- **Margins:** A consistent 16px lateral margin is applied to all main content blocks.
- **Vertical Rhythm:** Elements within a list item use 8px spacing (sm). Distinct functional sections (e.g., Input Area vs. List Area) use 20px spacing (lg).
- **Mobile Container:** The wireframe is housed in a white centered container with a max-width of 420px to simulate a mobile device on larger screens.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.
- **Level 0 (Background):** #F3F4F6 for the canvas.
- **Level 1 (Surface):** #FFFFFF for the mobile container and cards. These use a 1px border (#E5E7EB) to define edges.
- **Level 2 (Overlays):** Bottom sheets and modals use a soft, 10% opacity black shadow (0px 4px 12px) to differentiate from the base layer.
- **Interactions:** Subtle background shifts (to #F9FAFB) indicate hover or press states on list items.

## Shapes
The design system adopts a **Soft** shape language. 
- **Standard Radius:** 4px (0.25rem) for checkboxes and small tags.
- **Component Radius:** 8px (0.5rem) for input fields, buttons, and task cards.
- **Large Radius:** 12px (0.75rem) for bottom sheets (top corners only).
- **Checkboxes:** Specifically kept at a 4px radius to look distinct from circular radio buttons.

## Components
- **Buttons:** 
  - Primary: Blue background, white text, bold weight.
  - Secondary: White background, 1px border (#E5E7EB), Slate text.
  - Danger: Red background, white text.
- **Input Fields:** Height set to 48px. Uses 1px border. Placeholder text in #9CA3AF.
- **List Items:** Horizontal layout with a checkbox on the leading edge and a "Delete" icon on the trailing edge. Vertical padding of 12px.
- **Checkboxes:** 20x20px. When checked, uses Primary Blue with a simple white checkmark.
- **Filter Tabs:** Underline style for the active state. Active tab text is Primary Blue; inactive is Secondary Text.
- **Bottom Sheet:** Slides from bottom, covers 30-50% of screen. Includes a "Handle" (40x4px bar) at the top center.
- **Loading Spinner:** A simple 24px dashed circle stroke in Primary Blue.
- **Status Placeholders:** Centered illustration (simple wireframe box) with "暂无数据" (No Data) in Body-MD style.
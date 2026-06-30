# Design System: Kiremon (Retro Pixel UI)

## 1. Visual Theme & Atmosphere
The current project strictly follows a **"Retro / Pixel-Art"** aesthetic. It aims for a nostalgic, classic Pokémon/Gameboy feel combined with modern React components. The UI heavily relies on pixelated fonts, blocky borders, and standard color palettes applied via Emotion/styled-components.

## 2. Color Palette & Roles
Colors are imported from `@/components/utils` (`colors` object):
- **Grays:** `gray-100` (light backgrounds), `gray-300` (borders/links), `gray-900` (primary text, tooltips).
- **Primary Actions (Blue):** `blue-500`, `blue-600` for primary links, progress bars, and standard buttons.
- **Success (Green):** `green-100` to `green-700` for online status and success states.
- **Danger/Important (Red):** `red-100` to `red-700` for errors, busy status, and primary Add buttons.
- **Warning/Avatar (Yellow):** `yellow-200` to `yellow-700` for avatars, away status, and warnings.

## 3. Typography Rules
- **Global Font:** `"VT323", monospace` — This is the core pixel font used for almost all text across the app (`global.style.ts`).
- **Code & Monospace:** `"Fira Code", "Consolas", monospace` — Used specifically for code snippets and technical data (`Code` component).
- **Fallbacks:** `system-ui, Avenir, Helvetica, Arial, sans-serif` (defined in `index.css`).

## 4. Component Stylings (Emotion/Styled-components)
- **Pixel Borders (`.pxl-border`):** A custom CSS class in `global.style.ts` that uses an SVG `border-image` to create a classic 8-bit retro border. It uses an inset box-shadow for depth.
- **Buttons:** 
  - `AddButton`: Uses a linear gradient (e.g., `red-500` to `red-400`), 14px border radius, and box-shadow for depth.
  - `IconButton`: Flat background matching the color intent (`primary`, `danger`, `success`), subtle hover effects.
- **Avatars:** Circular, often with a yellow linear-gradient background.
- **Scrollbars:** Hidden globally across the app (`::-webkit-scrollbar { display: none; }`).

## 5. Layout Principles
- Extensively uses CSS Flexbox and CSS Grid (e.g., `GridContainer`, `ListContainer`).
- `TabsContainer`: Sticky top navigation with horizontal scrolling.
- `Overlay`: Fixed positioning with `rgba(0,0,0,0.5)` background for modals and dialogues.

## 6. Motion & Interaction
- **Hover States:** Simple, immediate color transitions (`transition: all 0.2s ease`).
- **Shimmer:** The `Skeleton` component uses an infinite CSS `shimmer` animation (1.5s) over a linear gradient to indicate loading states.
- **Tooltips:** Rely on CSS `:hover` states to transition opacity and visibility (`TooltipWrapper`).

## 7. Development Guidelines
- Always use `@emotion/styled` and the `colors` utility for styling.
- Maintain the pixel aesthetic by preferring the `"VT323"` font.
- Use the predefined `Typography` (`PageTitle`, `SectionTitle`, `Paragraph`) and `Layout` (`GridContainer`, `Divider`) components from `src/styles` instead of writing custom CSS for standard elements.

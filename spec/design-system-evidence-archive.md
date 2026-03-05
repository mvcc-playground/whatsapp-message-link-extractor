# Evidence Archive UI Design System

## Meta
- **Concept:** An organized, tactile, and slightly gritty 1950s Police Evidence Archive.
- **Atmosphere:** Analog, paper-based, tactile, mechanical, procedural.
- **Anti-AI Design Rules:** No soft blurs (box-shadows), no hyper-smooth rounded corners. Instead, use harsh directional shadows (neobrutalism-lite), 1px solid dark borders, noisy textures (grain), and high contrast.

## Visual Identity
- **Colors:**
  - Background: Olive drab green (`#4b5320` -> `bg-archive-green`) or metallic steel gray to simulate filing cabinets.
  - Paper (Cards): Aged manila yellow / off-white (`#f4ecd8` -> `bg-paper-manila`, `#fdfbf7` -> `bg-paper-light`).
  - Accents: Bright "Stamp" Red (`#c1121f` -> `bg-stamp-red`, text-stamp-red) for primary actions, warnings, and selections.
  - Ink: Carbon black (`#1a1a1a` -> `bg-ink-black`, text-ink-black) or dark blue (`#1d3557` -> text-ink-blue).
- **Typography:**
  - Headings/Titles: A bold, condensed Serif font (Playfair Display) mapped to `font-headline`. Always uppercase.
  - Data/Links: A rugged Monospace font (Special Elite, Courier, Fira Code) simulating typewriter text mapped to `font-typewriter`. Always use for interactive labels and inputs.
- **Textures:** Subtle CSS noise/grain overlay on the background to make it feel physical (`.bg-noise`).

## Core Utility Classes (Tailwind CSS v4)
When building new components, always use the following brutalist guidelines instead of generic defaults:
- **Shadows:** Use `shadow-brutal` (4px offset), `shadow-brutal-sm` (2px offset) instead of `shadow-md` or `shadow-lg`.
- **Borders:** Use solid `border-2 border-ink-black` everywhere. Do not use `rounded-md` or `rounded-lg` (edges should be sharp).
- **Buttons / Interactives:** Add hover/active states that feel physical. For buttons, use `hover:-translate-y-0.5 hover:shadow-brutal-hover active:translate-y-1 active:shadow-brutal-active`.
- **Checkboxes:** No smooth transitions. Built like an empty box with a hard handwritten "X".

## Components Reference

1. **Panels & Containers:**
   - Manila folder aesthetic: `bg-paper-manila` or `bg-paper-light`, `border-2 border-ink-black`, `shadow-brutal`.

2. **Buttons:**
   - **Primary:** `bg-stamp-red text-white shadow-brutal`
   - **Secondary:** `bg-paper-light text-ink-black shadow-brutal`
   - **Ghost:** `bg-transparent hover:bg-ink-black hover:text-white`
   - **Danger:** `bg-ink-black text-white shadow-brutal`

3. **Inputs / Textareas:**
   - Typewriter font (`font-typewriter`), `border-2 border-ink-black bg-paper-light text-ink-black outline-none focus:shadow-brutal-sm`. 
   - No rounded corners.

4. **Alerts / Warnings:**
   - Yellow paper aesthetic (`bg-yellow-200`) with red accents (`border-stamp-red`, `text-stamp-red`).

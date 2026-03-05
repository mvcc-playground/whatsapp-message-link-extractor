# Evidence Archive UI Design Plan

Date: 2026-03-04
Project: extract-links-whasapp-message

## Goal
Redesign the user interface of the link extractor application to be completely unique, breaking away from standard "AI-generated minimalist" web aesthetics. The chosen visual metaphor is a 1950s Detective/Police Evidence Archive.

## Core Metaphor & Vibe
- **Concept:** An organized, tactile, and slightly gritty 1950s Police Evidence Archive.
- **Atmosphere:** Analog, paper-based, tactile, mechanical, procedural.
- **Anti-AI Design Rules:** No soft blurs (box-shadows), no hyper-smooth rounded corners. Instead, use harsh directional shadows (neobrutalism-lite), 1px solid dark borders, noisy textures (grain), and high contrast.

## Visual Identity
- **Colors:**
  - Background: Olive drab green (`#4b5320`) or metallic steel gray to simulate filing cabinets.
  - Paper (Cards): Aged manila yellow / off-white (`#f4ecd8`).
  - Accents: Bright "Stamp" Red (`#c1121f`) for primary actions, warnings, and selections.
  - Ink: Carbon black (`#1a1a1a`) or dark blue (`#1d3557`).
- **Typography:**
  - Headings/Titles: A bold, condensed Serif font (evoking old newspaper headlines or official letterheads).
  - Data/Links: A rugged Monospace font (Courier, Fira Code) simulating typewriter text.
- **Textures:** Subtle CSS noise/grain overlay on the background to make it feel physical.

## Component Mapping (The "Evidence" System)

1. **FileUploadPanel (The Open Case File):**
   - **Visual:** A manila folder graphic sitting on a desk.
   - **Interaction:** Dragging a `.txt` file onto it triggers an animation of paper sheets dropping into the folder. The border is a stitched or dashed line, not a glowing neon ring.

2. **FilterPanel (The Indexing Tabs):**
   - **Visual:** Manila folder tabs protruding from the side or top, or resembling the drawers of a steel filing cabinet.
   - **Interaction:** Clicking a filter physically pushes the tab in or pulls a drawer out.

3. **LinksVirtualList (The Index Cards):**
   - **Visual:** Each link is an individual physical 3x5 index card.
   - **Styling:** Hard black shadows underneath (e.g., `box-shadow: 4px 4px 0px #000`). Text is typewriter-styled. Long links are truncated with raw `...`.
   - **Selection:** Checkboxes are styled as hand-drawn 'X' marks or hole-punches.

4. **SelectionToolbar & Summary (The Clipboard):**
   - **Visual:** A metallic bar or wooden clipboard docked at the bottom/top of the screen.
   - **Elements:** Counters look like mechanical dial counters or stamped numbers.

5. **ParseWarningsPanel (The Red Flags):**
   - **Visual:** Crumpled yellow sticky notes or red "REJECTED" rubber stamp marks overlaid on the screen.
   - **Interaction:** Can be "crumpled up" (closed) or "unstapled".

6. **ExportActions (The Official Report):**
   - **Visual:** A massive, chunky red button resembling a rubber stamp with the text "ARCHIVE EVIDENCE" or "GENERATE REPORT".
   - **Interaction:** Hard press animation (button moves down 4px, shadow disappears) with an optional mechanical sound effect.

## Implementation Strategy (Next Steps)
1. Configure global theme colors and fonts in `app.css` using Tailwind v4 `@theme` directives.
2. Apply a global grain texture using an SVG data-URI as a background utility class.
3. Overhaul each Svelte component (FileUploadPanel, LinksVirtualList, etc.) systematically, leveraging Tailwind CSS utility classes (e.g., `shadow-[4px_4px_0px_#000]`, `border-2 border-black`) to build the robust, tactile, hard-shadow neobrutalist styles.
4. Replace standard HTML checkboxes with custom SVG-based or pseudo-element "hand-drawn" checkboxes styled via Tailwind.
5. Update font imports in `app.html` (e.g., Google Fonts for a Typewriter and Serif font) and map them in Tailwind config.

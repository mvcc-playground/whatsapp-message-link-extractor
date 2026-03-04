# Tailwind CSS Installation Design (SvelteKit)

Date: 2026-03-04
Project: extract-links-whasapp-message

## Goal
Install Tailwind CSS in the SvelteKit app using the official framework guide flow.

## Chosen Approach
Use Tailwind v4 with Vite plugin (`@tailwindcss/vite`) and global stylesheet import.

## Changes
1. Install dependencies: `tailwindcss` and `@tailwindcss/vite` as devDependencies.
2. Update `vite.config.ts` to include `tailwindcss()` in plugins.
3. Create `src/app.css` with `@import "tailwindcss";`.
4. Import `../app.css` in `src/routes/+layout.svelte`.
5. Validate setup with `bun run check`.

## Rationale
This is the current official setup for SvelteKit + Tailwind v4 and avoids legacy `tailwind.config`-first workflows.

## Validation
`bun run check` returns 0 errors and 0 warnings.

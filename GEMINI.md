You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## UI Design Guidelines

This application follows a specific **"1950s Detective Evidence Archive"** UI design metaphor. It utilizes neobrutalism, harsh shadows, typewriter fonts, and Tailwind CSS v4.
**CRITICAL:** Do NOT use rounded soft corners (`rounded-lg`, etc.), soft box-shadows (`shadow-md`), or generic "AI-like" minimalist modern styles. Always maintain the tactile, physical paper aesthetics.
See the full specification and class references at `spec/design-system-evidence-archive.md`. When adding or editing UI components, strictly adhere to these rules.

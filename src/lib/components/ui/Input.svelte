<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { class: className = '', ...rest }: HTMLInputAttributes = $props();
</script>

<input
	{...rest}
	class={`w-full border-2 border-ink-black bg-paper-light px-3 py-2 font-typewriter text-sm font-bold text-ink-black outline-none transition-shadow placeholder:text-ink-black/50 focus:shadow-brutal-sm ${className}`}
/>
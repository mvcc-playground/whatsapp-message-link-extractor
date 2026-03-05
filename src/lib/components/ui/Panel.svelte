<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children,
		class: className = ''
	}: {
		title?: string;
		description?: string;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<section class={`border-2 border-ink-black bg-paper-manila p-5 shadow-brutal ${className}`}>
	{#if title}
		<header class="mb-4 border-b-2 border-ink-black pb-2">
			<h2 class="font-headline text-xl font-bold uppercase tracking-wide text-ink-black">{title}</h2>
			{#if description}
				<p class="mt-1 font-typewriter text-sm font-bold text-ink-blue">{description}</p>
			{/if}
		</header>
	{/if}
	{@render children?.()}
</section>
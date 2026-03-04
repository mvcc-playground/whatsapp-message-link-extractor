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

<section class={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
	{#if title}
		<header class="mb-3">
			<h2 class="text-base font-semibold text-slate-900">{title}</h2>
			{#if description}
				<p class="mt-1 text-sm text-slate-500">{description}</p>
			{/if}
		</header>
	{/if}
	{@render children?.()}
</section>
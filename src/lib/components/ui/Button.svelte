<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

	let {
		children,
		variant = 'primary',
		class: className = '',
		...rest
	}: HTMLButtonAttributes & { children?: Snippet; variant?: Variant } = $props();

	const variantClasses: Record<Variant, string> = {
		primary: 'bg-stamp-red text-white shadow-brutal active:shadow-brutal-active hover:shadow-brutal-hover active:translate-y-1 hover:translate-y-0.5',
		secondary: 'bg-paper-light text-ink-black shadow-brutal active:shadow-brutal-active hover:shadow-brutal-hover active:translate-y-1 hover:translate-y-0.5',
		ghost: 'bg-transparent text-ink-black hover:bg-ink-black hover:text-white border-transparent hover:border-ink-black',
		danger: 'bg-ink-black text-white shadow-brutal active:shadow-brutal-active hover:shadow-brutal-hover active:translate-y-1 hover:translate-y-0.5'
	};
</script>

<button
	{...rest}
	class={`inline-flex font-headline items-center justify-center gap-2 border-2 border-ink-black px-4 py-2 text-base font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-1 ${variantClasses[variant]} ${className}`}
>
	{@render children?.()}
</button>
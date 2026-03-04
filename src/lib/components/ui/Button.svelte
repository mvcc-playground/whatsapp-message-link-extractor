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
		primary: 'bg-slate-900 text-white hover:bg-slate-700',
		secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
		ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
		danger: 'bg-rose-700 text-white hover:bg-rose-600'
	};
</script>

<button
	{...rest}
	class={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
>
	{@render children?.()}
</button>
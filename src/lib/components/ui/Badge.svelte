<script lang="ts">
	let {
		label,
		tone = 'neutral'
	}: {
		label: string;
		tone?: 'neutral' | 'success' | 'warning';
	} = $props();

	const toneClasses = {
		neutral: 'bg-slate-200 text-slate-700',
		success: 'bg-emerald-100 text-emerald-700',
		warning: 'bg-amber-100 text-amber-700'
	};
</script>

<span class={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${toneClasses[tone]}`}>{label}</span>
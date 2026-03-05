<script lang="ts">
	let {
		label,
		tone = 'neutral'
	}: {
		label: string;
		tone?: 'neutral' | 'success' | 'warning';
	} = $props();

	const toneClasses = {
		neutral: 'bg-paper-light text-ink-black border-ink-black',
		success: 'bg-archive-green text-white border-ink-black',
		warning: 'bg-yellow-300 text-ink-black border-ink-black'
	};
</script>

<span class={`inline-flex border-2 px-2 py-0.5 font-typewriter text-xs font-bold uppercase tracking-wider ${toneClasses[tone]}`}>{label}</span>
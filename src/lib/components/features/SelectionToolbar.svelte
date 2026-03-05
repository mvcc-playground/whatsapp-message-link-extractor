<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		stats,
		onSelectAll,
		onInvert,
		onClear
	}: {
		stats: {
			total: number;
			eligible: number;
			nonEligible: number;
			selectedTotal: number;
			selectedEligible: number;
			selectedNonEligible: number;
			invertWouldSelectTotal: number;
		};
		onSelectAll: () => void;
		onInvert: () => void;
		onClear: () => void;
	} = $props();
</script>

<Panel title="PRANCHETA: Operações em Lote" description="Comandos executivos sobre as evidências filtradas.">
	<div class="mb-4 bg-ink-black p-2 font-typewriter text-xs font-bold text-white shadow-brutal-sm">
		[ STATUS: {stats.selectedTotal} MARCADOS | {stats.eligible} ELEGÍVEIS | PROJEÇÃO INVERSA: {stats.invertWouldSelectTotal} ]
	</div>
	<div class="flex flex-wrap items-center gap-3">
		<Button onclick={onSelectAll}>CARIMBAR ELEGÍVEIS ({stats.eligible})</Button>
		<Button variant="secondary" onclick={onInvert}>INVERTER SELEÇÃO ({stats.invertWouldSelectTotal})</Button>
		<Button variant="danger" onclick={onClear}>LIMPAR PRANCHETA</Button>
	</div>
</Panel>

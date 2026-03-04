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

<Panel title="Acoes de selecao" description="Operacoes em lote sobre o conjunto atual de links.">
	<div class="mb-2 text-xs text-slate-600">
		Selecionados agora: {stats.selectedTotal} | Elegiveis atuais: {stats.eligible} | Se inverter: {stats.invertWouldSelectTotal}
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Button onclick={onSelectAll}>Selecionar elegiveis ({stats.eligible})</Button>
		<Button variant="secondary" onclick={onInvert}>Inverter selecao (todos -> {stats.invertWouldSelectTotal})</Button>
		<Button variant="ghost" onclick={onClear}>Limpar selecao</Button>
	</div>
</Panel>

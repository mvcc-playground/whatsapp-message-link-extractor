<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let {
		stats
	}: {
		stats: { total: number; eligible: number; selectedTotal: number; selectedEligible: number };
	} = $props();
</script>

<Panel title="Resumo" description="Números atualizados em tempo real pelas stores derivadas.">
	<div class="flex flex-wrap gap-2">
		<Badge label={`Links totais: ${stats.total}`} />
		<Badge label={`Elegíveis: ${stats.eligible}`} tone="success" />
		<Badge label={`Selecionados: ${stats.selectedTotal}`} tone="warning" />
		<Badge label={`Selecionados elegíveis: ${stats.selectedEligible}`} />
	</div>
</Panel>
<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let {
		stats
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
	} = $props();
</script>

<Panel title="Resumo" description="Numeros atualizados em tempo real pelas stores derivadas.">
	<div class="flex flex-wrap gap-2">
		<Badge label={`Links totais: ${stats.total}`} />
		<Badge label={`Elegiveis: ${stats.eligible}`} tone="success" />
		<Badge label={`Nao elegiveis: ${stats.nonEligible}`} />
		<Badge label={`Selecionados: ${stats.selectedTotal}`} tone="warning" />
		<Badge label={`Selecionados elegiveis: ${stats.selectedEligible}`} />
		<Badge label={`Selecionados nao elegiveis: ${stats.selectedNonEligible}`} />
		<Badge label={`Se inverter: ${stats.invertWouldSelectTotal}`} />
	</div>
</Panel>

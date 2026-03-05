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

<Panel title="BALANÇO DE PROVAS" description="Números atualizados em tempo real pelo departamento.">
	<div class="flex flex-wrap gap-3">
		<Badge label={`LINHAS TOTAIS: ${stats.total}`} />
		<Badge label={`ELEGÍVEIS: ${stats.eligible}`} tone="success" />
		<Badge label={`NÃO ELEGÍVEIS: ${stats.nonEligible}`} />
		<Badge label={`SELECIONADOS (MARCADOS): ${stats.selectedTotal}`} tone="warning" />
		<Badge label={`SEL. ELEGÍVEIS: ${stats.selectedEligible}`} />
		<Badge label={`SEL. NÃO ELEGÍVEIS: ${stats.selectedNonEligible}`} />
		<Badge label={`PROJEÇÃO (INVERSÃO): ${stats.invertWouldSelectTotal}`} />
	</div>
</Panel>

<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		stats,
		onSelectAll,
		onInvert,
		onClear
	}: {
		stats: { total: number; eligible: number; selectedTotal: number; selectedEligible: number };
		onSelectAll: () => void;
		onInvert: () => void;
		onClear: () => void;
	} = $props();
</script>

<Panel title="Ações de seleção" description="Operações em lote sobre o conjunto elegível atual.">
	<div class="flex flex-wrap items-center gap-2">
		<Button onclick={onSelectAll}>Selecionar elegíveis ({stats.eligible})</Button>
		<Button variant="secondary" onclick={onInvert}>Inverter elegíveis</Button>
		<Button variant="ghost" onclick={onClear}>Limpar seleção</Button>
	</div>
</Panel>
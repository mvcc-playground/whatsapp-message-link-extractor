<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		selectedOutput,
		copyStatus,
		onCopy,
		onResetStatus
	}: {
		selectedOutput: string;
		copyStatus: 'idle' | 'success' | 'error';
		onCopy: () => Promise<void>;
		onResetStatus: () => void;
	} = $props();
</script>

<Panel title="Exportação" description="Copie os links selecionados (1 por linha).">
	<div class="space-y-3">
		<div class="flex flex-wrap items-center gap-2">
			<Button onclick={onCopy}>Copiar para clipboard</Button>
			{#if copyStatus === 'success'}
				<span class="text-sm text-emerald-700">Links copiados com sucesso.</span>
			{:else if copyStatus === 'error'}
				<span class="text-sm text-rose-700">Nada selecionado ou sem permissão de clipboard.</span>
			{/if}
			{#if copyStatus !== 'idle'}
				<Button variant="ghost" onclick={onResetStatus}>Ocultar status</Button>
			{/if}
		</div>
		<textarea
			readonly
			value={selectedOutput}
			class="h-36 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs"
			placeholder="A lista dos links selecionados aparece aqui."
		></textarea>
	</div>
</Panel>

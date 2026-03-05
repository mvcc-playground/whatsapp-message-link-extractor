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

<Panel title="RELATÓRIO OFICIAL: Exportação" description="Copie as evidências selecionadas para o clipboard (1 por linha).">
	<div class="space-y-4">
		<div class="flex flex-wrap items-center gap-3 bg-paper-light p-3 border-2 border-ink-black shadow-brutal-sm">
			<Button onclick={onCopy} class="!bg-stamp-red !text-white !py-3 !px-6 !text-lg">COPIAR RELATÓRIO (CLIPBOARD)</Button>
			{#if copyStatus === 'success'}
				<span class="font-typewriter text-sm font-bold text-archive-green px-2">[ SUCESSO: COPIADO PARA A PRANCHETA ]</span>
			{:else if copyStatus === 'error'}
				<span class="font-typewriter text-sm font-bold text-stamp-red px-2">[ ERRO: VAZIO OU SEM PERMISSÃO ]</span>
			{/if}
			{#if copyStatus !== 'idle'}
				<Button variant="ghost" onclick={onResetStatus}>[X] DISPENSAR AVISO</Button>
			{/if}
		</div>
		<textarea
			readonly
			value={selectedOutput}
			class="h-40 w-full border-4 border-ink-black bg-white p-4 font-typewriter text-sm font-bold text-ink-black outline-none shadow-brutal resize-y placeholder:text-ink-black/50"
			placeholder="[ AS EVIDÊNCIAS SELECIONADAS SERÃO DATILOGRAFADAS AQUI ]"
		></textarea>
	</div>
</Panel>

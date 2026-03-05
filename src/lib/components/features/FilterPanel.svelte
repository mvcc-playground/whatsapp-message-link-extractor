<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';

	import type { ChatMessage, FilterCriteria, SortMode } from '$lib/domain/whatsapp/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';

	let {
		criteria,
		messages,
		sortMode,
		onCriteriaChange,
		onSortChange,
		onReset
	}: {
		criteria: FilterCriteria;
		messages: readonly ChatMessage[];
		sortMode: SortMode;
		onCriteriaChange: (partial: Partial<FilterCriteria>) => void;
		onSortChange: (sortMode: SortMode) => void;
		onReset: () => void;
	} = $props();

	let untilPickerOpen = $state(false);
	let untilQuery = $state('');

	let selectedUntilMessage = $derived(
		criteria.untilMessageId ? messages.find((message) => message.id === criteria.untilMessageId) ?? null : null
	);

	let filteredUntilOptions = $derived.by(() => {
		const pool = messages.slice(-3000).reverse();
		const query = untilQuery.trim().toLowerCase();
		if (!query) {
			return pool.slice(0, 80);
		}

		return pool
			.filter((message) => describeMessage(message).toLowerCase().includes(query))
			.slice(0, 120);
	});

	function describeMessage(message: ChatMessage): string {
		const date = message.timestamp ? message.timestamp.toLocaleString('pt-BR') : 'Sem data';
		const preview = message.text.slice(0, 90).replace(/\s+/g, ' ');
		return `${date} | ${message.author ?? 'Sem autor'} | ${preview}`;
	}

	function pickUntilMessage(messageId: string): void {
		onCriteriaChange({ untilMessageId: messageId });
		untilPickerOpen = false;
	}
</script>

<Panel title="PARÂMETROS DE BUSCA: Filtros" description="Refine as evidências antes de arquivar.">
	<div class="grid gap-4 md:grid-cols-2">
		<label class="space-y-1 text-sm">
			<span class="font-headline font-bold uppercase text-ink-black">SUSPEITO (Autor)</span>
			<Input
				value={criteria.authorQuery}
				oninput={(event) => onCriteriaChange({ authorQuery: (event.currentTarget as HTMLInputElement).value })}
				placeholder="Ex: +55 11 9999-9999"
			/>
		</label>
		<label class="space-y-1 text-sm">
			<span class="font-headline font-bold uppercase text-ink-black">CONTEÚDO (Texto)</span>
			<Input
				value={criteria.textQuery}
				oninput={(event) => onCriteriaChange({ textQuery: (event.currentTarget as HTMLInputElement).value })}
				placeholder="Palavra-chave..."
			/>
		</label>
		<label class="space-y-1 text-sm">
			<span class="font-headline font-bold uppercase text-ink-black">ENDEREÇO (URL)</span>
			<Input
				value={criteria.urlQuery}
				oninput={(event) => onCriteriaChange({ urlQuery: (event.currentTarget as HTMLInputElement).value })}
				placeholder="Ex: drive.google.com"
			/>
		</label>
		<label class="space-y-1 text-sm">
			<span class="font-headline font-bold uppercase text-ink-black">ORDENAÇÃO DO DOSSIÊ</span>
			<select
				class="w-full border-2 border-ink-black bg-paper-light px-3 py-2 font-typewriter text-sm font-bold text-ink-black outline-none transition-shadow focus:shadow-brutal-sm"
				value={sortMode}
				onchange={(event) => onSortChange((event.currentTarget as HTMLSelectElement).value as SortMode)}
			>
				<option value="chronological">CRONOLÓGICA (ANTIGOS 1º)</option>
				<option value="reverse">REVERSA (RECENTES 1º)</option>
			</select>
		</label>
		<label class="space-y-1 text-sm">
			<span class="font-headline font-bold uppercase text-ink-black">DATA INICIAL</span>
			<Input type="datetime-local" value={criteria.from} oninput={(event) => onCriteriaChange({ from: (event.currentTarget as HTMLInputElement).value })} />
		</label>
		<label class="space-y-1 text-sm">
			<span class="font-headline font-bold uppercase text-ink-black">DATA FINAL</span>
			<Input type="datetime-local" value={criteria.to} oninput={(event) => onCriteriaChange({ to: (event.currentTarget as HTMLInputElement).value })} />
		</label>
	</div>

	<div class="mt-5 border-2 border-ink-black bg-white p-4 shadow-brutal-sm">
		<p class="font-headline text-base font-bold uppercase text-ink-black">CORTE TEMPORAL (MARCADOR)</p>
		<p class="mt-1 font-typewriter text-xs font-bold text-ink-blue">Descarta evidências anteriores à mensagem selecionada.</p>
		<p class="mt-2 border-l-4 border-stamp-red bg-paper-manila p-2 font-typewriter text-xs font-bold text-ink-black">
			{#if selectedUntilMessage}
				[ MARCADOR ATIVO ] {describeMessage(selectedUntilMessage)}
			{:else}
				[ NENHUM MARCADOR DEFINIDO ]
			{/if}
		</p>
		<div class="mt-4 flex flex-wrap gap-3">
			<Button variant="secondary" onclick={() => (untilPickerOpen = true)}>LOCALIZAR MENSAGEM...</Button>
			{#if criteria.untilMessageId}
				<Button variant="danger" onclick={() => onCriteriaChange({ untilMessageId: null })}>REMOVER MARCADOR</Button>
			{/if}
		</div>
	</div>

	<div class="mt-5 border-t-2 border-dashed border-ink-black pt-5">
		<Button variant="ghost" onclick={onReset}>[x] LIMPAR FILTROS</Button>
	</div>
</Panel>

<Dialog.Root
	open={untilPickerOpen}
	onOpenChange={(details) => {
		untilPickerOpen = details.open;
		if (details.open) {
			untilQuery = '';
		}
	}}
>
	<Dialog.Backdrop class="fixed inset-0 z-40 bg-ink-black/80 backdrop-blur-sm" />
	<Dialog.Positioner class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-14">
		<Dialog.Content class="w-full max-w-3xl border-4 border-ink-black bg-paper-manila p-6 shadow-brutal outline-none">
			<div class="mb-4 flex items-center justify-between border-b-4 border-ink-black pb-2">
				<Dialog.Title class="font-headline text-xl font-bold uppercase text-ink-black">LOCALIZAR MENSAGEM ALVO</Dialog.Title>
				<Dialog.CloseTrigger class="border-2 border-ink-black bg-white px-3 py-1 font-typewriter text-sm font-bold uppercase text-ink-black hover:bg-stamp-red hover:text-white transition-colors">[X] FECHAR</Dialog.CloseTrigger>
			</div>

			<Input
				value={untilQuery}
				oninput={(event) => (untilQuery = (event.currentTarget as HTMLInputElement).value)}
				placeholder="DIGITE PARTE DA MENSAGEM, AUTOR OU DATA..."
				class="mb-4"
			/>

			<div class="max-h-[50vh] space-y-3 overflow-auto pr-2">
				{#if filteredUntilOptions.length === 0}
					<p class="border-2 border-ink-black bg-white p-3 font-typewriter text-sm font-bold text-stamp-red">NENHUM RESULTADO ENCONTRADO NO ARQUIVO.</p>
				{:else}
					{#each filteredUntilOptions as message (message.id)}
						<button
							type="button"
							onclick={() => pickUntilMessage(message.id)}
							class="block w-full border-2 border-ink-black bg-white p-3 text-left font-typewriter text-sm font-bold text-ink-black shadow-brutal-sm transition-transform hover:-translate-y-0.5 hover:bg-paper-light active:translate-y-0 active:shadow-none"
						>
							{describeMessage(message)}
						</button>
					{/each}
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog.Root>

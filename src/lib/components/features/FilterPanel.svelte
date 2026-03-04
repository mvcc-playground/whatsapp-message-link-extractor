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

<Panel title="Filtros" description="Selecione ocorrencias dinamicamente antes de operar em massa.">
	<div class="grid gap-3 md:grid-cols-2">
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">Autor</span>
			<Input
				value={criteria.authorQuery}
				oninput={(event) => onCriteriaChange({ authorQuery: (event.currentTarget as HTMLInputElement).value })}
				placeholder="Filtrar por autor"
			/>
		</label>
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">Texto da mensagem</span>
			<Input
				value={criteria.textQuery}
				oninput={(event) => onCriteriaChange({ textQuery: (event.currentTarget as HTMLInputElement).value })}
				placeholder="Filtrar por texto"
			/>
		</label>
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">URL</span>
			<Input
				value={criteria.urlQuery}
				oninput={(event) => onCriteriaChange({ urlQuery: (event.currentTarget as HTMLInputElement).value })}
				placeholder="Filtrar por link"
			/>
		</label>
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">Ordenacao</span>
			<select
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
				value={sortMode}
				onchange={(event) => onSortChange((event.currentTarget as HTMLSelectElement).value as SortMode)}
			>
				<option value="chronological">Cronologica</option>
				<option value="reverse">Mais recentes primeiro</option>
			</select>
		</label>
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">Data inicial</span>
			<Input type="datetime-local" value={criteria.from} oninput={(event) => onCriteriaChange({ from: (event.currentTarget as HTMLInputElement).value })} />
		</label>
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">Data final</span>
			<Input type="datetime-local" value={criteria.to} oninput={(event) => onCriteriaChange({ to: (event.currentTarget as HTMLInputElement).value })} />
		</label>
	</div>

	<div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
		<p class="text-sm font-medium text-slate-700">Selecionar ate mensagem (inclusive)</p>
		<p class="mt-1 text-xs text-slate-500">Mantem apenas links da mensagem escolhida para frente (mais recentes).</p>
		<p class="mt-1 text-xs text-slate-500">
			{#if selectedUntilMessage}
				{describeMessage(selectedUntilMessage)}
			{:else}
				Sem limite de mensagem selecionado.
			{/if}
		</p>
		<div class="mt-3 flex flex-wrap gap-2">
			<Button variant="secondary" onclick={() => (untilPickerOpen = true)}>Pesquisar mensagem limite</Button>
			{#if criteria.untilMessageId}
				<Button variant="ghost" onclick={() => onCriteriaChange({ untilMessageId: null })}>Remover limite</Button>
			{/if}
		</div>
	</div>

	<div class="mt-4">
		<Button variant="secondary" onclick={onReset}>Resetar filtros</Button>
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
	<Dialog.Backdrop class="fixed inset-0 z-40 bg-slate-900/40" />
	<Dialog.Positioner class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-14">
		<Dialog.Content class="w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-4 shadow-xl outline-none">
			<div class="mb-3 flex items-center justify-between gap-2">
				<Dialog.Title class="text-base font-semibold text-slate-900">Buscar mensagem limite</Dialog.Title>
				<Dialog.CloseTrigger class="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600">Fechar</Dialog.CloseTrigger>
			</div>

			<Input
				value={untilQuery}
				oninput={(event) => (untilQuery = (event.currentTarget as HTMLInputElement).value)}
				placeholder="Digite autor, palavra ou trecho da mensagem"
				class="mb-3"
			/>

			<div class="max-h-[50vh] space-y-2 overflow-auto pr-1">
				{#if filteredUntilOptions.length === 0}
					<p class="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">Nenhuma mensagem compativel encontrada.</p>
				{:else}
					{#each filteredUntilOptions as message (message.id)}
						<button
							type="button"
							onclick={() => pickUntilMessage(message.id)}
							class="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
						>
							{describeMessage(message)}
						</button>
					{/each}
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Positioner>
</Dialog.Root>

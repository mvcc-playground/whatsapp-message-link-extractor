<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	import type { ChatMessage, ExtractedLinkOccurrence } from '$lib/domain/whatsapp/types';

	let {
		occurrences,
		totalOccurrences,
		selectedIds,
		messageById,
		onToggle,
		onSelectUntil
	}: {
		occurrences: readonly ExtractedLinkOccurrence[];
		totalOccurrences: number;
		selectedIds: Set<string>;
		messageById: Map<string, ChatMessage>;
		onToggle: (occurrenceId: string) => void;
		onSelectUntil: (messageId: string) => void;
	} = $props();

	let pageSizeOption = $state<'100' | '200' | '500' | 'all'>('200');
	let currentPage = $state(1);
	let pageSize = $derived(
		pageSizeOption === 'all' ? Math.max(1, occurrences.length) : Number(pageSizeOption)
	);

	let totalPages = $derived(Math.max(1, Math.ceil(occurrences.length / pageSize)));
	let startIndex = $derived((currentPage - 1) * pageSize);
	let endIndex = $derived(Math.min(occurrences.length, startIndex + pageSize));
	let pageItems = $derived(occurrences.slice(startIndex, endIndex));

	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
		if (currentPage < 1) {
			currentPage = 1;
		}
	});

	function formatTimestamp(timestamp: Date | null): string {
		return timestamp ? timestamp.toLocaleString('pt-BR') : 'Data indisponivel';
	}
</script>

<Panel title="Ocorrencias de links" description="Lista paginada para manter fluidez e previsibilidade em historicos grandes.">
	<div class="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
		<div class="text-xs text-slate-600">
			Elegiveis: {occurrences.length} de {totalOccurrences} total
		</div>
		<div class="text-xs text-slate-600">
			Mostrando {occurrences.length === 0 ? 0 : startIndex + 1}-{endIndex} de {occurrences.length}
		</div>
		<div class="flex items-center gap-2">
			<label class="text-xs text-slate-600" for="page-size-select">Por pagina</label>
			<select
				id="page-size-select"
				class="rounded-md border border-slate-300 px-2 py-1 text-xs"
				value={pageSizeOption}
				onchange={(event) => {
					pageSizeOption = (event.currentTarget as HTMLSelectElement).value as
						| '100'
						| '200'
						| '500'
						| 'all';
					currentPage = 1;
				}}
			>
				<option value="100">100</option>
				<option value="200">200</option>
				<option value="500">500</option>
				<option value="all">Todos</option>
			</select>
		</div>
	</div>

	<div class="max-h-[65vh] overflow-auto rounded-lg border border-slate-200 bg-slate-50">
		{#if pageItems.length === 0}
			<p class="p-3 text-sm text-slate-500">Nenhum link para exibir com os filtros atuais.</p>
		{:else}
			{#each pageItems as occurrence (occurrence.occurrenceId)}
				{@const message = messageById.get(occurrence.messageId)}
				<article class="grid gap-3 border-b border-slate-200 bg-white p-3">
					<div class="flex items-start justify-between gap-3">
						<Checkbox
							label={occurrence.normalizedUrl}
							checked={selectedIds.has(occurrence.occurrenceId)}
							onCheckedChange={() => onToggle(occurrence.occurrenceId)}
							class="flex-1"
						/>
						<Button variant="ghost" onclick={() => onSelectUntil(occurrence.messageId)}>
							Selecionar daqui para frente
						</Button>
					</div>
					<div class="grid gap-1 text-xs text-slate-500 md:grid-cols-3">
						<span>Linha: {occurrence.lineNumber}</span>
						<span>Autor: {message?.author ?? occurrence.author ?? 'Sem autor'}</span>
						<span>{formatTimestamp(occurrence.timestamp)}</span>
					</div>
					{#if message?.text}
						<p class="line-clamp-2 text-xs text-slate-600">{message.text}</p>
					{/if}
				</article>
			{/each}
		{/if}
	</div>

	{#if pageSizeOption !== 'all'}
		<div class="mt-3 flex items-center justify-between gap-2">
			<Button variant="ghost" onclick={() => (currentPage = Math.max(1, currentPage - 1))} disabled={currentPage <= 1}>
				Pagina anterior
			</Button>
			<p class="text-xs text-slate-600">Pagina {currentPage} de {totalPages}</p>
			<Button
				variant="ghost"
				onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
				disabled={currentPage >= totalPages}
			>
				Proxima pagina
			</Button>
		</div>
	{/if}
</Panel>

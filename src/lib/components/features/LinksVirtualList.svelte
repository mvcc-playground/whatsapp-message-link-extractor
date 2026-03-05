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

<Panel title="ARQUIVO DE EVIDÊNCIAS: Links" description="Fichas catalográficas paginadas.">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-2 border-2 border-ink-black bg-paper-light p-3 shadow-brutal-sm">
		<div class="font-typewriter text-xs font-bold text-ink-black">
			[ ELEGÍVEIS: {occurrences.length} DE {totalOccurrences} ]
		</div>
		<div class="font-typewriter text-xs font-bold text-ink-black">
			[ EXIBINDO: {occurrences.length === 0 ? 0 : startIndex + 1}-{endIndex} / {occurrences.length} ]
		</div>
		<div class="flex items-center gap-2">
			<label class="font-typewriter text-xs font-bold text-ink-black" for="page-size-select">LOTE:</label>
			<select
				id="page-size-select"
				class="border-2 border-ink-black bg-white px-2 py-1 font-typewriter text-xs font-bold outline-none"
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
				<option value="all">TODOS</option>
			</select>
		</div>
	</div>

	<div class="relative flex max-h-[65vh] flex-col gap-4 overflow-auto p-1">
		{#if pageItems.length === 0}
			<p class="border-2 border-ink-black bg-paper-light p-4 font-typewriter text-sm font-bold text-ink-black">
				NENHUMA EVIDÊNCIA ENCONTRADA COM OS FILTROS ATUAIS.
			</p>
		{:else}
			{#each pageItems as occurrence (occurrence.occurrenceId)}
				{@const message = messageById.get(occurrence.messageId)}
				<article class="flex flex-col gap-3 border-2 border-ink-black bg-paper-light p-4 shadow-brutal transition-transform hover:-translate-y-1">
					<div class="flex items-start justify-between gap-3 border-b-2 border-dashed border-ink-black pb-3">
						<Checkbox
							label={occurrence.normalizedUrl}
							checked={selectedIds.has(occurrence.occurrenceId)}
							onCheckedChange={() => onToggle(occurrence.occurrenceId)}
							class="flex-1 break-all"
						/>
						<Button variant="ghost" onclick={() => onSelectUntil(occurrence.messageId)}>
							[ SELECIONAR DAQUI P/ FRENTE ]
						</Button>
					</div>
					<div class="grid gap-2 font-typewriter text-xs font-bold text-ink-blue md:grid-cols-3">
						<span class="bg-paper-manila px-2 py-1 border-2 border-ink-black">LINHA: {occurrence.lineNumber}</span>
						<span class="bg-paper-manila px-2 py-1 border-2 border-ink-black truncate">AUTOR: {message?.author ?? occurrence.author ?? 'DESCONHECIDO'}</span>
						<span class="bg-paper-manila px-2 py-1 border-2 border-ink-black">{formatTimestamp(occurrence.timestamp).toUpperCase()}</span>
					</div>
					{#if message?.text}
						<p class="mt-2 border-l-4 border-stamp-red bg-white p-2 font-typewriter text-sm font-bold text-ink-black">
							"{message.text}"
						</p>
					{/if}
				</article>
			{/each}
		{/if}
	</div>

	{#if pageSizeOption !== 'all'}
		<div class="mt-5 flex items-center justify-between gap-2 border-t-2 border-ink-black pt-4">
			<Button variant="secondary" onclick={() => (currentPage = Math.max(1, currentPage - 1))} disabled={currentPage <= 1}>
				&lt; ANTERIOR
			</Button>
			<p class="font-typewriter text-sm font-bold text-ink-black">PÁG. {currentPage} DE {totalPages}</p>
			<Button
				variant="secondary"
				onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
				disabled={currentPage >= totalPages}
			>
				PRÓXIMA &gt;
			</Button>
		</div>
	{/if}
</Panel>

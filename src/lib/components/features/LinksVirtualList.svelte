<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	import type { ChatMessage, ExtractedLinkOccurrence } from '$lib/domain/whatsapp/types';

	let {
		occurrences,
		selectedIds,
		messageById,
		rowHeight,
		onToggle,
		onSelectUntil
	}: {
		occurrences: readonly ExtractedLinkOccurrence[];
		selectedIds: Set<string>;
		messageById: Map<string, ChatMessage>;
		rowHeight: number;
		onToggle: (occurrenceId: string) => void;
		onSelectUntil: (messageId: string) => void;
	} = $props();

	let scrollTop = $state(0);
	let viewportHeight = $state(540);
	const overscan = 5;

	let startIndex = $derived(Math.max(0, Math.floor(scrollTop / rowHeight) - overscan));
	let visibleCount = $derived(Math.ceil(viewportHeight / rowHeight) + overscan * 2);
	let endIndex = $derived(Math.min(occurrences.length, startIndex + visibleCount));
	let totalHeight = $derived(occurrences.length * rowHeight);
	let topPadding = $derived(startIndex * rowHeight);
	let bottomPadding = $derived(Math.max(0, totalHeight - topPadding - (endIndex - startIndex) * rowHeight));
	let windowed = $derived(occurrences.slice(startIndex, endIndex));

	function handleScroll(event: Event): void {
		const target = event.currentTarget as HTMLElement;
		scrollTop = target.scrollTop;
		viewportHeight = target.clientHeight;
	}

	function formatTimestamp(timestamp: Date | null): string {
		return timestamp ? timestamp.toLocaleString('pt-BR') : 'Data indisponível';
	}
</script>

<Panel title="Ocorrências de links" description="Lista virtualizada para manter fluidez em históricos longos.">
	<div class="h-[540px] overflow-auto rounded-lg border border-slate-200 bg-slate-50" onscroll={handleScroll}>
		<div style={`padding-top: ${topPadding}px; padding-bottom: ${bottomPadding}px`}>
			{#each windowed as occurrence (occurrence.occurrenceId)}
				{@const message = messageById.get(occurrence.messageId)}
				<article class="grid gap-3 border-b border-slate-200 bg-white p-3" style={`min-height: ${rowHeight}px`}>
					<div class="flex items-start justify-between gap-3">
						<Checkbox
							label={occurrence.normalizedUrl}
							checked={selectedIds.has(occurrence.occurrenceId)}
							onCheckedChange={() => onToggle(occurrence.occurrenceId)}
							class="flex-1"
						/>
						<Button variant="ghost" onclick={() => onSelectUntil(occurrence.messageId)}>Selecionar até aqui</Button>
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
		</div>
	</div>
</Panel>

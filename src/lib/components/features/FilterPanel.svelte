<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import type { ChatMessage, FilterCriteria, SortMode } from '$lib/domain/whatsapp/types';

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

	let messageOptions = $derived(messages.slice(-500));

	function describeMessage(message: ChatMessage): string {
		const date = message.timestamp ? message.timestamp.toLocaleString('pt-BR') : 'Sem data';
		const preview = message.text.slice(0, 70).replace(/\s+/g, ' ');
		return `${date} | ${message.author ?? 'Sem autor'} | ${preview}`;
	}
</script>

<Panel title="Filtros" description="Selecione ocorrências dinamicamente antes de operar em massa.">
	<div class="grid gap-3 md:grid-cols-2">
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">Autor</span>
			<Input value={criteria.authorQuery} oninput={(event) => onCriteriaChange({ authorQuery: (event.currentTarget as HTMLInputElement).value })} placeholder="Filtrar por autor" />
		</label>
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">Texto da mensagem</span>
			<Input value={criteria.textQuery} oninput={(event) => onCriteriaChange({ textQuery: (event.currentTarget as HTMLInputElement).value })} placeholder="Filtrar por texto" />
		</label>
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">URL</span>
			<Input value={criteria.urlQuery} oninput={(event) => onCriteriaChange({ urlQuery: (event.currentTarget as HTMLInputElement).value })} placeholder="Filtrar por link" />
		</label>
		<label class="space-y-1 text-sm">
			<span class="text-slate-600">Ordenação</span>
			<select class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={sortMode} onchange={(event) => onSortChange((event.currentTarget as HTMLSelectElement).value as SortMode)}>
				<option value="chronological">Cronológica</option>
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

	<div class="mt-3 space-y-1">
		<label class="text-sm text-slate-600" for="until-message">Selecionar até mensagem (inclusive)</label>
		<select
			id="until-message"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
			value={criteria.untilMessageId ?? ''}
			onchange={(event) => {
				const value = (event.currentTarget as HTMLSelectElement).value;
				onCriteriaChange({ untilMessageId: value || null });
			}}
		>
			<option value="">Sem limite</option>
			{#each messageOptions as message (message.id)}
				<option value={message.id}>{describeMessage(message)}</option>
			{/each}
		</select>
	</div>

	<div class="mt-4">
		<Button variant="secondary" onclick={onReset}>Resetar filtros</Button>
	</div>
</Panel>

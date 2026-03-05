<script lang="ts">
	import { onMount } from 'svelte';

	import ExportActions from '$lib/components/features/ExportActions.svelte';
	import FileUploadPanel from '$lib/components/features/FileUploadPanel.svelte';
	import FilterPanel from '$lib/components/features/FilterPanel.svelte';
	import LinksVirtualList from '$lib/components/features/LinksVirtualList.svelte';
	import ParseWarningsPanel from '$lib/components/features/ParseWarningsPanel.svelte';
	import SelectionSummary from '$lib/components/features/SelectionSummary.svelte';
	import SelectionToolbar from '$lib/components/features/SelectionToolbar.svelte';
	import {
		copyStatusStore,
		filterCriteriaStore,
		hasLoadedFileStore,
		ingestErrorStore,
		messagesStore,
		rawFileNameStore,
		selectedIdsStore,
		selectedLinksOutputStore,
		selectionStatsStore,
		uiPreferencesStore,
		visibleOccurrencesStore,
		warningsStore,
		exportActions,
		filterActions,
		ingestActions,
		selectionActions,
		viewActions
	} from '$lib/stores';
	import { startClientLogFlushOnUnload } from '$lib/logging/client-debug';
	import { startStoreDebugging } from '$lib/logging/store-debug';
	import { persistPreferences, restorePreferences } from '$lib/utils/persistence';

	let messageById = $derived(new Map($messagesStore.map((message) => [message.id, message])));

	onMount(() => {
		restorePreferences();
		const stopPersist = persistPreferences();
		const stopStoreDebug = startStoreDebugging();
		const stopUnloadFlush = startClientLogFlushOnUnload();

		return () => {
			stopPersist();
			stopStoreDebug();
			stopUnloadFlush();
		};
	});
</script>

<svelte:head>
	<title>Extrator de Links do WhatsApp</title>
</svelte:head>

<main class="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
	<header class="border-2 border-ink-black bg-paper-light p-6 shadow-brutal">
		<h1 class="font-headline text-3xl font-black uppercase tracking-widest text-ink-black">
			Arquivo de Evidências: Extrator de Links
		</h1>
		<p class="mt-3 max-w-3xl border-l-4 border-stamp-red pl-4 text-sm font-bold text-ink-blue">
			DEPARTAMENTO DE ANÁLISE: Importe um documento TXT, filtre ocorrências e opere seleção dinâmica com ações em massa. Restrito.
		</p>
	</header>

	<FileUploadPanel
		error={$ingestErrorStore}
		fileName={$rawFileNameStore}
		onFileSelected={ingestActions.loadTxt}
		onReset={() => {
			ingestActions.reset();
			filterActions.reset();
			selectionActions.clearAll();
		}}
	/>

	{#if $hasLoadedFileStore}
		<SelectionSummary stats={$selectionStatsStore} />
		<FilterPanel
			criteria={$filterCriteriaStore}
			messages={$messagesStore}
			sortMode={$uiPreferencesStore.sortMode}
			onCriteriaChange={filterActions.setCriteria}
			onSortChange={viewActions.setSortMode}
			onReset={filterActions.reset}
		/>

		<SelectionToolbar
			stats={$selectionStatsStore}
			onSelectAll={selectionActions.selectAllEligible}
			onInvert={selectionActions.invertEligible}
			onClear={selectionActions.clearAll}
		/>

		<LinksVirtualList
			occurrences={$visibleOccurrencesStore}
			totalOccurrences={$selectionStatsStore.total}
			selectedIds={$selectedIdsStore}
			messageById={messageById}
			onToggle={selectionActions.toggleOccurrence}
			onSelectUntil={(messageId) => {
				filterActions.setUntilMessage(messageId);
				selectionActions.selectAllEligible();
			}}
		/>

		<ExportActions
			selectedOutput={$selectedLinksOutputStore}
			copyStatus={$copyStatusStore}
			onCopy={exportActions.copySelectedToClipboard}
			onResetStatus={exportActions.resetCopyState}
		/>

		<ParseWarningsPanel warnings={$warningsStore} />
	{:else}
		<section class="border-2 border-ink-black bg-paper-manila p-8 text-center text-lg font-bold text-ink-black shadow-brutal">
			<span class="block text-2xl mb-2">📎 CAIXA VAZIA</span>
			Envie o arquivo do caso (TXT) para iniciar a triagem das provas e habilitar os filtros de investigação.
		</section>
	{/if}
</main>

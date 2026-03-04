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

<main class="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:p-6">
	<header class="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
		<h1 class="text-2xl font-bold tracking-tight text-slate-900">Extrator de Links do WhatsApp</h1>
		<p class="mt-2 max-w-3xl text-sm text-slate-600">
			Core reativo com Nanostores: importe um TXT, filtre ocorrencias e opere selecao dinamica com acoes em massa.
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
			selectedIds={$selectedIdsStore}
			messageById={messageById}
			rowHeight={$uiPreferencesStore.rowHeight}
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
		<section class="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
			Envie um arquivo para iniciar o parsing e habilitar filtros/selecao.
		</section>
	{/if}
</main>

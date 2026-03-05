<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let {
		error,
		fileName,
		onFileSelected,
		onReset
	}: {
		error: string | null;
		fileName: string | null;
		onFileSelected: (file: File) => Promise<void> | void;
		onReset: () => void;
	} = $props();

	async function handleFileChange(event: Event): Promise<void> {
		const target = event.currentTarget as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) {
			return;
		}

		try {
			await onFileSelected(file);
		} catch {
			// File errors are surfaced by the ingest store state.
		} finally {
			target.value = '';
		}
	}
</script>

<Panel title="PASTA DE EVIDÊNCIAS: Importar" description="Anexe o arquivo .txt (Exportado do WhatsApp) para iniciar a investigação.">
	<div class="flex flex-col gap-4">
		<input
			type="file"
			accept=".txt,text/plain"
			onchange={handleFileChange}
			class="w-full cursor-pointer border-2 border-dashed border-ink-black bg-paper-light p-8 font-typewriter text-sm font-bold text-ink-black transition-colors hover:bg-paper-manila file:mr-4 file:cursor-pointer file:border-2 file:border-ink-black file:bg-ink-black file:px-4 file:py-2 file:font-headline file:text-sm file:font-bold file:uppercase file:text-white file:shadow-brutal file:transition-all hover:file:translate-y-0.5 hover:file:shadow-brutal-hover"
		/>
		{#if fileName}
			<p class="border-l-4 border-ink-blue pl-3 font-typewriter text-sm font-bold text-ink-black">
				DOCUMENTO ANEXADO: <span class="bg-yellow-200 px-1">{fileName}</span>
			</p>
		{/if}
		{#if error}
			<p class="border-2 border-stamp-red bg-red-100 p-3 font-typewriter text-sm font-bold text-stamp-red shadow-brutal-sm">
				[ERRO] {error}
			</p>
		{/if}
		<div class="mt-2 flex justify-end">
			<Button variant="ghost" onclick={onReset}>[x] DESCARTAR EVIDÊNCIAS</Button>
		</div>
	</div>
</Panel>

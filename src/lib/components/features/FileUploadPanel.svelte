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
		} catch (error) {
			console.error('Failed to process selected file', error);
		} finally {
			target.value = '';
		}
	}
</script>

<Panel title="Importar histórico" description="Envie um arquivo .txt exportado do WhatsApp.">
	<div class="flex flex-col gap-3">
		<input
			type="file"
			accept=".txt,text/plain"
			onchange={handleFileChange}
			class="w-full rounded-lg border border-dashed border-slate-400 p-6 text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-white"
		/>
		{#if fileName}
			<p class="text-sm text-slate-600">Arquivo carregado: <span class="font-medium text-slate-900">{fileName}</span></p>
		{/if}
		{#if error}
			<p class="rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>
		{/if}
		<div>
			<Button variant="ghost" onclick={onReset}>Limpar dados</Button>
		</div>
	</div>
</Panel>

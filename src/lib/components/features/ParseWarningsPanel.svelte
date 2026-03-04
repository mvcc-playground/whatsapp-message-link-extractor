<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	import type { ParseWarning } from '$lib/domain/whatsapp/types';

	let { warnings }: { warnings: readonly ParseWarning[] } = $props();
</script>

{#if warnings.length > 0}
	<Panel title="Avisos de parsing" description="Linhas fora do padrão foram ignoradas.">
		<div class="mb-3">
			<Badge label={`${warnings.length} aviso(s)`} tone="warning" />
		</div>
		<ul class="max-h-44 space-y-2 overflow-auto pr-2">
			{#each warnings.slice(0, 50) as warning (warning.lineNumber + warning.reason)}
				<li class="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
					<span class="font-semibold">Linha {warning.lineNumber}:</span> {warning.reason}
				</li>
			{/each}
		</ul>
	</Panel>
{/if}

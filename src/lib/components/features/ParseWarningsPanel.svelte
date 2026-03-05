<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	import type { ParseWarning } from '$lib/domain/whatsapp/types';

	let { warnings }: { warnings: readonly ParseWarning[] } = $props();
</script>

{#if warnings.length > 0}
	<Panel title="ALERTAS DE ANÁLISE" description="Registros danificados ou fora do protocolo." class="!bg-yellow-200 !border-stamp-red">
		<div class="mb-4">
			<Badge label={`${warnings.length} ANOMALIA(S) DETECTADA(S)`} tone="warning" />
		</div>
		<ul class="max-h-48 space-y-3 overflow-auto pr-2">
			{#each warnings.slice(0, 50) as warning (warning.lineNumber + warning.reason)}
				<li class="border-l-4 border-stamp-red bg-white px-4 py-3 font-typewriter text-xs font-bold text-ink-black shadow-brutal-sm">
					<span class="bg-stamp-red px-1 text-white">LINHA {warning.lineNumber}:</span> {warning.reason.toUpperCase()}
				</li>
			{/each}
		</ul>
	</Panel>
{/if}

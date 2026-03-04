<script lang="ts">
	import { Checkbox } from '@ark-ui/svelte/checkbox';

	let {
		checked = false,
		label,
		onCheckedChange,
		disabled = false,
		class: className = ''
	}: {
		checked?: boolean;
		label: string;
		onCheckedChange?: (checked: boolean) => void;
		disabled?: boolean;
		class?: string;
	} = $props();
</script>

<Checkbox.Root
	checked={checked}
	disabled={disabled}
	onCheckedChange={(details) => onCheckedChange?.(details.checked === true)}
	class={`flex cursor-pointer items-center gap-2 ${disabled ? 'opacity-60' : ''} ${className}`}
>
	<Checkbox.HiddenInput />
	<Checkbox.Control class="flex h-4 w-4 items-center justify-center rounded border border-slate-400 data-[state=checked]:border-slate-900 data-[state=checked]:bg-slate-900">
		<Checkbox.Indicator class="text-[10px] font-bold leading-none text-white">x</Checkbox.Indicator>
	</Checkbox.Control>
	<Checkbox.Label class="text-sm text-slate-700">{label}</Checkbox.Label>
</Checkbox.Root>
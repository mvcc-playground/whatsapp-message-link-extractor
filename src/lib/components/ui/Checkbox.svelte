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
	class={`flex cursor-pointer items-center gap-3 ${disabled ? 'opacity-60' : ''} ${className}`}
>
	<Checkbox.HiddenInput />
	<Checkbox.Control class="flex h-5 w-5 items-center justify-center border-2 border-ink-black bg-paper-light data-[state=checked]:bg-paper-light">
		<Checkbox.Indicator class="font-typewriter text-lg font-bold leading-none text-stamp-red">X</Checkbox.Indicator>
	</Checkbox.Control>
	<Checkbox.Label class="font-typewriter text-sm font-bold text-ink-black">{label}</Checkbox.Label>
</Checkbox.Root>
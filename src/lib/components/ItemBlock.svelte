<script lang="ts">
	import type { Item } from '$lib/models/items.models';
	import Icon from '@iconify/svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';

	export let data: Item;
	const dispatch = createEventDispatcher();

	const {
		elements: { trigger, menu, item, separator, arrow },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true,
		closeOnItemClick: true,
		closeOnOutsideClick: true,
		positioning: {
			placement: 'bottom-end'
		}
	});
</script>

<button
	type="button"
	use:melt={$trigger}
	class="grid grid-cols-8 p-3 border rounded-md items-center"
>
	<div class="col-span-4 flex items-start">{data.name}</div>
	<div class="col-span-2 flex items-start">{data.max_quantity}</div>
	<div class="col-span-1 flex justify-end capitalize">{data.unit}</div>
	<div class="col-span-1 flex justify-end items-center">
		<Icon icon="mi:options-vertical" />
	</div>
</button>

{#if $open}
	<div use:melt={$menu} class="bg-white flex flex-col gap-1 w-52 border rounded-md z-40 p-3">
		<button
			class="px-3 py-2 flex items-center justify-start gap-3 bg-gray-100 rounded-md"
			use:melt={$item}
			on:click={() => dispatch('edit', data)}
		>
			<Icon icon="material-symbols:edit" />
			<span>Edit</span>
		</button>
		<button
			class="px-3 py-2 flex items-center justify-start gap-3 bg-red-100 rounded-md"
			use:melt={$item}
			on:click={() => dispatch('delete', data)}
		>
			<Icon icon="material-symbols:delete" />
			<span>Delete</span>
		</button>
	</div>
{/if}

<script lang="ts">
	import type { Item } from '$lib/models/items.models';
	import Icon from '@iconify/svelte';

	export let item: Item;
</script>

<div class="grid grid-cols-8 p-3 border rounded-md">
	<div class="col-span-4">{item.name}</div>
	<div class="col-span-2">{item.max_quantity}</div>
	<div class="col-span-1 flex justify-end">{item.unit}</div>
	<div class="col-span-1 flex justify-end items-center">
		<Icon icon="mi:options-vertical" />
	</div>
</div>

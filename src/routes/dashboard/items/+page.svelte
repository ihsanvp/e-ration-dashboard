<script lang="ts">
	import { getFirestoreApp } from '$lib/firebase/firestore.client';
	import type { Item } from '$lib/models/items.models';
	import { useQuery } from '@sveltestack/svelte-query';
	import { collection, getDocs, orderBy, query } from 'firebase/firestore';
	import Icon from '@iconify/svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import ItemBlock from '$lib/components/ItemBlock.svelte';
	import AddItemDialog from '$lib/components/AddItemDialog.svelte';
	import DeleteItemDialog from '$lib/components/DeleteItemDialog.svelte';

	let deleteItemDialog: DeleteItemDialog;

	const queryResult = useQuery<Item[], Error>('items', async () => {
		const q = query(collection(getFirestoreApp(), 'items'), orderBy('timestamp'));
		return (await getDocs(q)).docs.map((doc) => ({
			...doc.data(),
			id: doc.id
		})) as Item[];
	});

	function onDeleteItem(e: CustomEvent<Item>) {
		deleteItemDialog.start(e.detail);
	}
</script>

{#if $queryResult.isLoading}
	<div class="h-[80vh] flex items-center justify-center">
		<Spinner color="black" width="3px" size="40px" />
	</div>
{:else if $queryResult.error}
	<span>An error has occurred: {$queryResult.error.message}</span>
{:else if $queryResult.isSuccess}
	<DeleteItemDialog bind:this={deleteItemDialog} />
	<div class="flex items-center justify-between py-5 px-3 sticky top-16 bg-white border-b gap-5">
		<div class="flex-1">
			<input class="w-full border border-gray-300 rounded-md" type="search" placeholder="Search" />
		</div>
		<AddItemDialog />
	</div>
	<div class="grid grid-cols-10 border-b sticky px-5 py-5 bg-white top-36 items-center">
		<div class="text-lg font-medium col-span-4">Name</div>
		<div class="text-lg font-medium col-span-4">Max Quantity</div>
		<div class="text-lg font-medium col-span-1 flex justify-end">Unit</div>
	</div>
	<div class="flex flex-col gap-5 p-3">
		{#each $queryResult.data as item}
			<ItemBlock on:delete={onDeleteItem} data={item} />
		{/each}
	</div>
{/if}

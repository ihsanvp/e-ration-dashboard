<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';
	import { useQueryClient, useMutation } from '@sveltestack/svelte-query';
	import { addDoc, collection, doc } from 'firebase/firestore';
	import { getFirestoreApp } from '$lib/firebase/firestore.client';
	import type { Item, ItemData } from '$lib/models/items.models';
	import Spinner from './Spinner.svelte';

	let name: string;
	let unit: string;
	let max_quantity: number;

	const {
		elements: { trigger, portalled, overlay, content, title, description, close },
		states: { open }
	} = createDialog({
		role: 'alertdialog',
		closeOnOutsideClick: false
	});

	const queryClient = useQueryClient();

	const mutation = useMutation<Item, Error, ItemData>(
		async (item: ItemData) => {
			const docRef = await addDoc(collection(getFirestoreApp(), 'items'), item);
			return {
				...item,
				id: docRef.id
			};
		},
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries('items');
			}
		}
	);
</script>

<button
	class="p-2 flex items-center justify-center border rounded-md bg-black text-white"
	use:melt={$trigger}
>
	<Icon width={25} icon="material-symbols:add" />
</button>

<div use:melt={$portalled}>
	{#if $open}
		<div class="fixed inset-0 z-50 backdrop-blur-sm bg-black/20" use:melt={$overlay} />
		<div
			class="fixed flex flex-col bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] w-[90vw] z-50 border border-white rounded-md"
			use:melt={$content}
		>
			{#if $mutation.isLoading}
				<div class="absolute inset-0 z-50 bg-white flex items-center justify-center">
					<Spinner color="black" width="3px" size="40px" />
				</div>
			{:else if $mutation.isError}
				<div class="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center">
					<div class="flex-1 flex flex-col items-center justify-center p-5">
						<div class="text-2xl font-medium">Error</div>
						<div>{$mutation.error?.message}</div>
					</div>
					<div class="p-5">
						<button use:melt={$close} class="bg-black text-white px-10 py-3 text-sm">Close</button>
					</div>
				</div>
			{:else if $mutation.isSuccess}
				<div class="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center">
					<div class="flex-1 flex flex-col items-center justify-center p-5">
						<div class="text-2xl font-medium">Success</div>
						<div>New Item ({$mutation.data?.name}) added</div>
					</div>
					<div class="p-5">
						<button use:melt={$close} class="bg-black text-white px-10 py-3 text-sm">Close</button>
					</div>
				</div>
			{/if}
			<h2 class="text-xl font-medium p-5 text-center">Add new Item</h2>
			<form
				class="p-5 flex flex-col gap-5"
				on:submit|preventDefault={() => $mutation.mutate({ name, unit, max_quantity })}
			>
				<label for="add-item__name">
					<p class="mb-2">Name</p>
					<input bind:value={name} class="w-full rounded-md" type="text" id="add-item__name" />
				</label>
				<label for="add-item__unit">
					<p class="mb-2">Unit</p>
					<input bind:value={unit} class="w-full rounded-md" type="text" id="add-item__unit" />
				</label>
				<label for="add-item__max-quantity">
					<p class="mb-2">Max Quantity</p>
					<input
						bind:value={max_quantity}
						class="w-full rounded-md"
						type="number"
						id="add-item__max-quantity"
					/>
				</label>
				<div class="grid grid-cols-2 items-center gap-5 mt-5">
					<button class="bg-gray-200 py-3 text-sm rounded-md" type="button" use:melt={$close}
						>Cancel</button
					>
					<button class="bg-black text-white py-3 text-sm rounded-md" type="submit">Add</button>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	.btndisabled {
		@apply opacity-30;
	}
</style>

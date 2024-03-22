<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';
	import { useQueryClient, useMutation } from '@sveltestack/svelte-query';
	import { Timestamp, addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
	import { getFirestoreApp } from '$lib/firebase/firestore.client';
	import type { Item, ItemData } from '$lib/models/items.models';
	import Spinner from './Spinner.svelte';
	import type { UserWithAllocation } from '$lib/models/auth.models';
	import type { AllocationItem } from '$lib/models/allocations.data';

	export let data: UserWithAllocation;

	let values: AllocationItem[] = data.allocation.items.slice();

	const {
		elements: { trigger, portalled, overlay, content, title, description, close },
		states: { open }
	} = createDialog({
		role: 'alertdialog',
		closeOnOutsideClick: false
	});

	const queryClient = useQueryClient();

	const mutation = useMutation<void, Error, UserWithAllocation>(
		async (user) => {
			await setDoc(doc(getFirestoreApp(), 'allocations', `allocation__${user.uid}`), {
				user: user.uid,
				timestamp: serverTimestamp(),
				items: user.allocation.items
			});
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries('users');
			}
		}
	);

	function closeModal() {
		values = values.map((value, i) => ({ ...value, quantity: data.allocation.items[i].quantity }));
		setTimeout(() => {
			$mutation.reset();
			$open = false;
		}, 50);
	}

	function onSubmit() {
		const user: UserWithAllocation = { ...data };
		user.allocation.items = values;
		$mutation.mutate(user);
	}
</script>

<button use:melt={$trigger} class="bg-black text-white px-5 py-2 text-sm rounded-md"
	>Manage Allocations</button
>

<div use:melt={$portalled}>
	{#if $open}
		<div class="fixed inset-0 z-50 backdrop-blur-sm bg-black/20" use:melt={$overlay} />
		<div
			class="fixed flex flex-col justify-between bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[90vh] w-[90vw] z-50 border border-white rounded-md"
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
						<button on:click={closeModal} class="bg-black text-white px-10 py-3 text-sm rounded-md"
							>Close</button
						>
					</div>
				</div>
			{:else if $mutation.isSuccess}
				<div class="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center">
					<div class="flex-1 flex flex-col items-center justify-center p-5">
						<div class="text-2xl font-medium">Success</div>
						<div>Updated allocations for {data.profile?.name}</div>
					</div>
					<div class="p-5">
						<button on:click={closeModal} class="bg-black text-white px-10 py-3 text-sm rounded-md"
							>Close</button
						>
					</div>
				</div>
			{/if}
			<h2 use:melt={$title} class="text-xl font-medium p-5 text-center">
				Manage Allocations for {data.profile?.name}
			</h2>
			<form
				class="p-5 flex-1 flex flex-col gap-5 overflow-y-scroll"
				on:submit|preventDefault={onSubmit}
			>
				{#each data.allocation.items as item, i}
					<label for={`manage-allocation__${item.id}`}>
						<p class="mb-2">{item.name}</p>
						<div class="flex items-center gap-3">
							<input
								class="w-full rounded-md flex-1"
								type="range"
								bind:value={values[i].quantity}
								min="0"
								max={item.max_quantity}
								step="0.1"
								id={`manage-allocation__${item.id}`}
							/>
							<p class="w-10">{values[i].quantity}{item.unit}</p>
						</div>
					</label>
				{/each}
			</form>
			<div class="px-5 pb-5 grid grid-cols-2 items-center gap-5 mt-5">
				<button class="bg-gray-200 py-3 text-sm rounded-md" type="button" on:click={closeModal}
					>Cancel</button
				>
				<button class="bg-black text-white py-3 text-sm rounded-md" type="submit">Update</button>
			</div>
		</div>
	{/if}
</div>

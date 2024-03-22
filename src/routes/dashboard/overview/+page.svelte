<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';
	import { getFirestoreApp } from '$lib/firebase/firestore.client';
	import Icon from '@iconify/svelte';
	import { useQuery } from '@sveltestack/svelte-query';
	import { collection, getCountFromServer } from 'firebase/firestore';

	interface OverviewResult {
		bookings_count: number;
		items_count: number;
	}

	const queryResult = useQuery<OverviewResult, Error>('overview', async () => {
		const db = getFirestoreApp();
		return {
			bookings_count: (await getCountFromServer(collection(db, 'bookings'))).data().count,
			items_count: (await getCountFromServer(collection(db, 'items'))).data().count
		};
	});
</script>

{#if $queryResult.isLoading}
	<div class="h-[80vh] flex items-center justify-center">
		<Spinner color="black" width="3px" size="40px" />
	</div>
{:else if $queryResult.error}
	<span>An error has occurred: {$queryResult.error.message}</span>
{:else if $queryResult.isSuccess}
	<div class="flex flex-col gap-5 p-3">
		<div class="flex items-center justify-between gap-5 p-5 border rounded-md">
			<div class="flex flex-col gap-3">
				<div class="text-xl font-medium">Bookings</div>
				<div class="text-2xl text-gray-600">{$queryResult.data.bookings_count}</div>
			</div>
			<Icon class="text-gray-800" width={60} icon="lets-icons:order-fill" />
		</div>
		<div class="flex items-center justify-between gap-5 p-5 border rounded-md">
			<div class="flex flex-col gap-3">
				<div class="text-xl font-medium">Items</div>
				<div class="text-2xl text-gray-600">{$queryResult.data.items_count}</div>
			</div>
			<Icon class="text-gray-800" width={60} icon="mdi:briefcase" />
		</div>
	</div>
{/if}

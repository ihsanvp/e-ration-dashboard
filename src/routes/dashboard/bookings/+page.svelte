<script lang="ts">
	import { getFirestoreApp } from '$lib/firebase/firestore.client';
	import type { Booking, BookingPopulated } from '$lib/models/bookings.models';
	import { useQuery } from '@sveltestack/svelte-query';
	import { Timestamp, collection, getDocs } from 'firebase/firestore';
	import Icon from '@iconify/svelte';

	const queryResult = useQuery<BookingPopulated[], Error>('bookings', () =>
		fetch('/api/bookings').then((res) => res.json())
	);
</script>

{#if $queryResult.isLoading}
	<span>Loading...</span>
{:else if $queryResult.error}
	<span>An error has occurred: {$queryResult.error.message}</span>
{:else if $queryResult.isSuccess}
	<div class="flex items-center justify-between py-5 px-3 sticky top-16 bg-white border-b gap-5">
		<div class="flex-1">
			<input class="w-full border border-gray-300 rounded-md" type="search" placeholder="Search" />
		</div>
		<button class="p-2 flex items-center justify-center border rounded-md border-gray-300">
			<Icon width={25} icon="carbon:generate-pdf" />
		</button>
	</div>
	<div class="flex flex-col gap-5 p-3">
		{#each $queryResult.data as booking}
			<div class="border border-gray-950 rounded-md">
				<div
					class="flex items-center justify-between border-b p-3 bg-gray-950 border-gray-900 rounded-t-md"
				>
					<div class="text-md text-gray-200">#{booking.id}</div>
				</div>
				<div class="p-3 flex items-center justify-between">
					<div class="flex items-center justify-center gap-3 flex-1 overflow-hidden">
						<Icon class="text-gray-600" width={50} icon="mingcute:user-4-fill" />
						<div class="flex flex-col flex-1">
							<div class="text-lg capitalize">{booking.user.profile?.name}</div>
							<div class="text-sm text-gray-600">{booking.user.phoneNumber}</div>
						</div>
					</div>
					<div class="text-gray-600 text-sm">
						{Timestamp.fromMillis(booking.timestamp).toDate().toDateString()}
					</div>
				</div>
				<div class="p-3 border-t border-gray-950">
					{#each booking.items as item}
						<div class="flex items-center justify-between">
							<span>{item.name}</span>
							<span>{`${item.max_quantity}${item.unit}`}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

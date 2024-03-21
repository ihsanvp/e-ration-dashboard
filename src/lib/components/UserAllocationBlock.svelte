<script lang="ts">
	import type { UserWithAllocation } from '$lib/models/auth.models';
	import Icon from '@iconify/svelte';

	export let data: UserWithAllocation;
</script>

<div class="border rounded-md border-gray-400">
	<div class="flex items-center gap-5 px-5 pt-5">
		<div class="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full">
			<Icon width={30} icon="solar:user-bold" />
		</div>
		<div class="flex flex-col">
			<div class="text-lg font-medium capitalize">{data.profile?.name}</div>
			<div class="text-xs text-gray-400 capitalize">{data.profile?.address}</div>
		</div>
	</div>
	<div class="grid grid-cols-6 divide-x divide-gray-400 mt-5 px-5">
		<div class="flex flex-col px-3 gap-2 col-span-1">
			<div class="text-xs text-gray-400">Age</div>
			<div class="text-md font-medium">{data.profile?.dob.slice(0, 2)}</div>
		</div>
		<div class="flex flex-col px-3 gap-2 col-span-2">
			<div class="text-xs text-gray-400">Bookings</div>
			<div class="text-md font-medium">{data.bookings_count}</div>
		</div>
		<div class="flex flex-col px-3 gap-2 col-span-3">
			<div class="text-xs text-gray-400">Mobile Number</div>
			<div class="text-md font-medium">{data.phoneNumber}</div>
		</div>
	</div>
	<div class="my-5 px-5">
		<div class="bg-gray-100 rounded-md p-3">
			<div class="grid grid-cols-3 mb-5">
				<div class="col-span-1 font-bold">Item</div>
				<div class="col-span-1 font-bold text-center">Allocated</div>
				<div class="col-span-1 font-bold text-right">Available</div>
			</div>
			{#each data.allocation.items as item}
				<div class="grid grid-cols-3">
					<div class="col-span-1">{item.name}</div>
					<div class="col-span-1 text-center">{item.quantity}{item.unit}</div>
					<div class="col-span-1 text-right">{item.max_quantity}{item.unit}</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="px-5 py-3 border-t border-gray-400 flex items-center justify-end">
		<button class="bg-black text-white px-5 py-2 text-sm rounded-md">Manage Allocations</button>
	</div>
</div>

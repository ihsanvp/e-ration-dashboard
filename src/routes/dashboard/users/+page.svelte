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
	import type { User, UserWithAllocation } from '$lib/models/auth.models';
	import UserAllocationBlock from '$lib/components/UserAllocationBlock.svelte';

	const queryResult = useQuery<UserWithAllocation[], Error>('users', () =>
		fetch('/api/users').then((res) => res.json())
	);
</script>

{#if $queryResult.isLoading}
	<div class="h-[80vh] flex items-center justify-center">
		<Spinner color="black" width="3px" size="40px" />
	</div>
{:else if $queryResult.error}
	<span>An error has occurred: {$queryResult.error.message}</span>
{:else if $queryResult.isSuccess}
	<!-- {#if $queryResult.isRefetching}
		<div class="fixed top-36 inset-0 bg-white/20 backdrop-blur-sm z-10"></div>
	{/if} -->
	<div class="flex items-center justify-between py-5 px-3 sticky top-16 bg-white border-b gap-5">
		<div class="flex-1">
			<input class="w-full border border-gray-300 rounded-md" type="search" placeholder="Search" />
		</div>
	</div>
	<div class="flex flex-col gap-5 p-3">
		{#each $queryResult.data as user}
			<UserAllocationBlock data={user} />
		{/each}
	</div>
{/if}

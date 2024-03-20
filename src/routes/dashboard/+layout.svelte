<script>
	import Drawer from '$lib/components/Drawer.svelte';
	import { melt } from '@melt-ui/svelte';
	import Icon from '@iconify/svelte';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';

	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<header
		class="fixed top-0 left-0 right-0 h-16 border-b bg-white flex items-center justify-between px-3"
	>
		<Drawer
			let:trigger
			items={[
				{
					label: 'Overview',
					icon: 'mage:dashboard-2-fill',
					href: '/dashboard/overview'
				},
				{
					label: 'Bookings',
					icon: 'lets-icons:order-fill',
					href: '/dashboard/bookings'
				},
				{
					label: 'Users',
					icon: 'mage:users-fill',
					href: '/dashboard/users'
				}
			]}
		>
			<button
				use:melt={trigger}
				class="p-1 flex items-center justify-center w-9 h-9 border rounded-md border-gray-300"
			>
				<Icon width={20} icon="material-symbols:menu" />
			</button>
		</Drawer>
	</header>
	<main class="pt-16">
		<slot />
	</main>
</QueryClientProvider>

<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';

	let { children } = $props();
</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer" type="checkbox" class="drawer-toggle" />
	
	<div class="drawer-content flex flex-col">
		<header class="navbar bg-base-100 shadow-md">
			<div class="navbar-start">
				<label for="my-drawer" class="btn btn-square btn-ghost lg:hidden">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
				</label>
				<a href="/" class="btn btn-ghost text-xl">Simply Tweeted</a>
			</div>
			<div class="navbar-end">
				{#if $page.data.session}
					<a href="/dashboard" class="btn btn-ghost">Dashboard</a>
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
							<div class="w-10 rounded-full">
								<img alt="User avatar" src={$page.data.session.user?.image || 'https://via.placeholder.com/40'} />
							</div>
						</div>
						<ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
							<li><a href="/profile">Profile</a></li>
							<li><button on:click={() => signOut()} class="w-full text-left">Sign out</button></li>
						</ul>
					</div>
				{:else}
					<a href="/login" class="btn btn-primary">Login</a>
				{/if}
			</div>
		</header>

		<main class="flex-grow p-4">
			{@render children()}
		</main>

		<footer class="footer footer-center p-4 bg-base-300 text-base-content">
			<div>
				<p>© 2023 Simply Tweeted - Schedule your tweets with ease</p>
			</div>
		</footer>
	</div>
	
	<div class="drawer-side">
		<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="menu p-4 w-64 min-h-full bg-base-200 text-base-content flex flex-col">
			<div>
				<ul class="menu">
					<li><a href="/">Home</a></li>
					{#if $page.data.session}
						<li><a href="/post">Schedule a Tweets</a></li>
						<li><a href="/tweets">Tweets History</a></li>
					{:else}
						<li><a href="/login">Login</a></li>
					{/if}
				</ul>
			</div>
			
			{#if $page.data.session}
				<div class="mt-auto border-t pt-4">
					<div class="flex items-center gap-3 mb-3">
						<div class="avatar">
							<div class="w-10 rounded-full">
								<img src={$page.data.session.user?.image || 'https://via.placeholder.com/40'} alt="Profile" />
							</div>
						</div>
						<div class="font-medium">
							{$page.data.session.user?.name || 'User'}
						</div>
					</div>
					<button on:click={() => signOut()} class="btn btn-error btn-sm w-full">
						Sign out
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

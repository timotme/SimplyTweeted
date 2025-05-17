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
			<div class="mb-4">
				<a href="/" class="flex items-center gap-2 px-2 py-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
					</svg>
					<span class="text-xl font-bold">Simply Tweeted</span>
				</a>
			</div>

			<div class="border-b border-base-300 mb-4"></div>

			<ul class="menu menu-lg gap-2">
				<li>
					<a href="/" class="flex items-center gap-3 text-sm">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
						</svg>
						Home
					</a>
				</li>
				{#if $page.data.session}
					<li>
						<a href="/post" class="flex items-center gap-3 text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Post a Tweet
						</a>
					</li>
					<li>
						<a href="/scheduled" class="flex items-center gap-3 text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							Scheduled Tweets
						</a>
					</li>
					<li>
						<a href="/history" class="flex items-center gap-3 text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
							Tweet History
						</a>
					</li>
				{:else}
					<li>
						<a href="/login" class="flex items-center gap-3 text-sm">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
							</svg>
							Login
						</a>
					</li>
				{/if}
			</ul>
			
			{#if $page.data.session}
				<div class="mt-auto border-t border-base-300 pt-4">
					<div class="flex items-center gap-3 mb-3 px-3">
						<div class="avatar">
							<div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
								<img src={$page.data.session.user?.image || 'https://via.placeholder.com/40'} alt="Profile" />
							</div>
						</div>
						<div>
							<div class="font-medium">
								{$page.data.session.user?.name || 'User'}
							</div>
							<div class="text-sm text-base-content/70">
								@{$page.data.session.user?.email?.split('@')[0] || 'username'}
							</div>
						</div>
					</div>
					<button on:click={() => signOut()} class="btn btn-error btn-sm w-full gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						Sign out
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

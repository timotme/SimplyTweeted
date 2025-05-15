<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<header class="navbar bg-base-100 shadow-md">
		<div class="navbar-start">
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
						<li><a href="/api/auth/signout">Sign out</a></li>
					</ul>
				</div>
			{:else}
				<a href="/login" class="btn btn-primary">Login</a>
			{/if}
		</div>
	</header>

	<main class="flex-grow">
		{@render children()}
	</main>

	<footer class="footer footer-center p-4 bg-base-300 text-base-content">
		<div>
			<p>© 2023 Simply Tweeted - Schedule your tweets with ease</p>
		</div>
	</footer>
</div>

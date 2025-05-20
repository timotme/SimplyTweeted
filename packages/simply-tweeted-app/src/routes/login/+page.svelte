<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="mb-6 text-5xl font-bold">Simply Tweeted</h1>
			<p class="py-6">Schedule your tweets with ease. Login to get started.</p>
			<div>
				<!-- <img src="/img/logo.svg" alt="Company Logo" /> -->
				<button on:click={() => signIn('twitter')} class="btn btn-primary"
					>Sign in with Twitter</button
				>
			</div>
		</div>
	</div>
</div>

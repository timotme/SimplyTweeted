<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="hero min-h-[80vh] bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">Simply Tweeted</h1>
			<p class="py-6">Schedule your tweets with ease. The simplest way to manage your X (Twitter) content.</p>
			{#if $page.data.session}
				<a href="/dashboard" class="btn btn-primary">Go to Dashboard</a>
			{:else}
				<a href="/login" class="btn btn-primary">Get Started</a>
			{/if}
		</div>
	</div>
</div>

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

<div class="py-12 bg-base-100">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-8">Features</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body items-center text-center">
					<h3 class="card-title">Schedule Tweets</h3>
					<p>Plan your content in advance and let Simply Tweeted post it at the perfect time.</p>
				</div>
			</div>
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body items-center text-center">
					<h3 class="card-title">Analytics</h3>
					<p>Track engagement and measure the performance of your scheduled tweets.</p>
				</div>
			</div>
			<div class="card bg-base-200 shadow-xl">
				<div class="card-body items-center text-center">
					<h3 class="card-title">Thread Support</h3>
					<p>Create and schedule entire tweet threads with our intuitive interface.</p>
				</div>
			</div>
		</div>
	</div>
</div>

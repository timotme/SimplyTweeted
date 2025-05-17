<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData | null | undefined = null;

	// Reactive statement to refresh data when form action is successful
	$: if (form?.success) {
		alert('Tweet deleted successfully!'); // Or use a more sophisticated notification
		invalidateAll(); // Refreshes all data, causing the list to update
		form = null; // Reset form state
	}

	$: if (form?.error) {
		alert(`Error: ${form.error}`);
		form = null; // Reset form state
	}

	function formatDate(dateString: string | Date): string {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', { 
			year: 'numeric', month: 'long', day: 'numeric', 
			hour: '2-digit', minute: '2-digit', hour12: true 
		});
	}
</script>

<svelte:head>
	<title>Scheduled Tweets</title>
	<meta name="description" content="View and manage your scheduled tweets" />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">Your Scheduled Tweets</h1>

	{#if data.tweets && data.tweets.length > 0}
		<div class="grid gap-4">
			{#each data.tweets as tweet (tweet.id)}
				<div class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
					<div class="card-body">
						<p class="text-lg mb-3 whitespace-pre-wrap">{tweet.content}</p>
						<div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
							<div class="space-y-2">
								<div class="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<p class="text-sm">
										{formatDate(tweet.scheduledDate)}
									</p>
								</div>
								<div class="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
									<p class="text-sm">
										{tweet.community}
									</p>
								</div>
							</div>
							<form method="POST" action="?/deleteTweet" use:enhance class="inline-block">
								<input type="hidden" name="tweetId" value={tweet.id} />
								<button 
									type="submit" 
									class="btn btn-error"
									on:click={(event) => !confirm('Are you sure you want to delete this scheduled tweet?') && event.preventDefault()}
								>
									Delete
								</button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="mt-8 flex justify-center items-center space-x-2">
				{#if data.currentPage > 1}
					<a href="/scheduled?page={data.currentPage - 1}" 
					   class="btn btn-outline btn-sm">
						Previous
					</a>
				{/if}

				{#each Array(data.totalPages) as _, i}
					{@const pageNum = i + 1}
					<a href="/scheduled?page={pageNum}" 
					   class="btn btn-sm {pageNum === data.currentPage ? 'btn-primary' : 'btn-outline'}"
					>
						{pageNum}
					</a>
				{/each}

				{#if data.currentPage < data.totalPages}
					<a href="/scheduled?page={data.currentPage + 1}" 
					   class="btn btn-outline btn-sm">
						Next
					</a>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="card bg-base-200 shadow-lg">
			<div class="card-body items-center text-center py-12">
				<svg class="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-14a2 2 0 00-2 2v1a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
				</svg>
				<h3 class="mt-4 text-xl font-medium">No Scheduled Tweets</h3>
				<p class="mt-1 text-sm">You currently have no tweets scheduled. Schedule one to see it here!</p>
				<!-- Optional: Link to where user can schedule tweets -->
				<div class="mt-6">
					<a href="/post" class="btn btn-primary">
						Schedule a Tweet
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>
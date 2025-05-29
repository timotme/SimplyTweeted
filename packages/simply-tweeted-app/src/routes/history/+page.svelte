<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import TweetCard from '$lib/components/TweetCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	export let data: PageData;

</script>

<svelte:head>
	<title>Tweet History</title>
	<meta name="description" content="View your sent tweets history" />
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">Your Tweet History</h1>

	{#if data.tweets && data.tweets.length > 0}
		<div class="grid gap-4">
			{#each data.tweets as tweet (tweet.id)}
				<TweetCard 
					{tweet}  
					showDeleteButton={false} 
				/>
			{/each}
		</div>

		<Pagination 
			currentPage={data.currentPage} 
			totalPages={data.totalPages} 
			basePath="/history" 
		/>
	{:else}
		<EmptyState 
			title="No Tweet History" 
			message="You haven't posted any tweets yet. Create and schedule a tweet to see it here after it's posted."
			actionLink="/post"
			actionText="Create a Tweet"
		/>
	{/if}
</div> 
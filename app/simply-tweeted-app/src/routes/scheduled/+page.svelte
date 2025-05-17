<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import TweetCard from '$lib/components/TweetCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

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

	function handleDelete(tweetId: string) {
		const formData = new FormData();
		formData.append('tweetId', tweetId);
		
		fetch('?/deleteTweet', {
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(result => {
			if (result.success) {
				invalidateAll();
				alert('Tweet deleted successfully!');
			} else {
				alert(`Error: ${result.error}`);
			}
		})
		.catch(error => {
			alert(`Error: ${error.message}`);
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
				<TweetCard 
					{tweet} 
					onDelete={handleDelete} 
					showDeleteButton={true} 
				/>
			{/each}
		</div>

		<Pagination 
			currentPage={data.currentPage} 
			totalPages={data.totalPages} 
			basePath="/scheduled" 
		/>
	{:else}
		<EmptyState 
			title="No Scheduled Tweets" 
			message="You currently have no tweets scheduled. Schedule one to see it here!"
			actionLink="/post"
			actionText="Schedule a Tweet"
		/>
	{/if}
</div>
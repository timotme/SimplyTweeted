<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	export let data: PageData;

	let tweetContent = '';
	let scheduledDate = new Date().toISOString().split('T')[0]; // Today's date as default
	let scheduledTime = new Date(Math.ceil((Date.now() + 15 * 60000) / (5 * 60000)) * 5 * 60000).toTimeString().slice(0, 5); // Default time is 15 minutes from now, rounded to next 5min
	let community = '';
	let charCount = 0;
	let isDateTimeValid = true;
	let showEmojiPicker = false;
	let emojiPickerElement: HTMLElement;
	let userTimezone = '';
	
	$: charCount = tweetContent.length;
	$: isValidTweet = charCount > 0 && charCount <= 280 && isDateTimeValid;
	
	$: {
		const now = new Date();
		// Create the scheduled date/time in the user's local timezone for validation
		const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
		isDateTimeValid = scheduledDateTime > now;
	}

	function handleEmojiSelect(event: CustomEvent) {
		const emoji = event.detail.unicode;
		tweetContent += emoji;
	}

	function handleClickOutside(event: MouseEvent) {
		if (showEmojiPicker && emojiPickerElement && !emojiPickerElement.contains(event.target as Node)) {
			showEmojiPicker = false;
		}
	}

	onMount(async () => {
		if (browser) {
			await import('emoji-picker-element');
			window.addEventListener('click', handleClickOutside, true);
			
			// Detect user's timezone
			userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('click', handleClickOutside, true);
		}
	});
</script>

<div class="container mx-auto max-w-3xl py-8 px-4">
	<h1 class="text-3xl font-bold mb-6">Schedule a Tweet</h1>
	
	<div class="card bg-base-200 shadow-xl">
		<div class="card-body">
			<form method="POST" use:enhance>
				<div class="form-control mb-4">
					<label class="label" for="content">
						<span class="label-text">Tweet Content</span>
					</label>
					<div class="relative">
						<textarea 
							id="content" 
							name="content" 
							bind:value={tweetContent} 
							class="textarea textarea-bordered h-40 w-full text-lg" 
							placeholder="What's on your mind? Share your thoughts here..."
							required
						></textarea>
						<button 
							type="button"
							class="btn btn-circle btn-md absolute right-2 bottom-2"
							on:click|stopPropagation={() => showEmojiPicker = !showEmojiPicker}
						>
							😊
						</button>
						{#if browser && showEmojiPicker}
							<div class="absolute right-0 top-full mt-2 z-50" bind:this={emojiPickerElement}>
								<emoji-picker on:emoji-click={handleEmojiSelect}></emoji-picker>
							</div>
						{/if}
					</div>
                    <div class="label-text-alt text-right mt-2">{charCount}/280</div>

					{#if charCount > 280}
						<div class="label-text-alt text-error mt-2">Tweet exceeds maximum length</div>
					{/if}
				</div>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div class="form-control">
						<label class="label" for="scheduledDate">
							<span class="label-text">Date</span>
						</label>
						<input 
							type="date" 
							id="scheduledDate" 
							name="scheduledDate" 
							bind:value={scheduledDate} 
							class="input input-bordered {!isDateTimeValid ? 'input-error' : ''}" 
							required
						/>
					</div>
					
					<div class="form-control">
						<label class="label" for="scheduledTime">
							<span class="label-text">Time</span>
						</label>
						<input 
							type="time" 
							id="scheduledTime" 
							name="scheduledTime" 
							bind:value={scheduledTime} 
							class="input input-bordered {!isDateTimeValid ? 'input-error' : ''}" 
							required
						/>
					</div>
				</div>
				
				{#if !isDateTimeValid}
					<div class="alert alert-error mb-4">
						<span>Schedule time must be in the future</span>
					</div>
				{/if}
				
				<div class="form-control mb-6">
					<label class="label" for="community">
						<span class="label-text">Community</span>
					</label>
					<select id="community" name="community" bind:value={community} class="select select-bordered w-full">
						<option value="">None</option>
						{#each data.availableCommunities as communityOption}
							<option value={communityOption}>{communityOption}</option>
						{/each}
					</select>
				</div>
				
				<!-- Hidden input to send user's timezone -->
				<input type="hidden" name="timezone" value={userTimezone} />
				
				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary" disabled={!isValidTweet}>
						Schedule Tweet
					</button>
				</div>
			</form>
		</div>
	</div>
</div> 
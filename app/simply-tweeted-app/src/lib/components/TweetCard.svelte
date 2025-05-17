<script lang="ts">
  import type { Tweet } from '$lib/types';
  import { TweetStatus } from '$lib/types';
  
  export let tweet: Tweet;
  export let onDelete: (id: string) => void = () => {};
  export let showDeleteButton: boolean = true;
  
  function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this tweet?')) {
      onDelete(tweet.id || '');
    }
  }
</script>

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
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm">
            Status: <span class={tweet.status === TweetStatus.POSTED ? 'text-success' : tweet.status === TweetStatus.FAILED ? 'text-error' : 'text-info'}>
              {tweet.status}
            </span>
          </p>
        </div>
      </div>
      {#if showDeleteButton}
        <button 
          class="btn btn-error"
          on:click={handleDelete}
        >
          Delete
        </button>
      {/if}
    </div>
  </div>
</div> 
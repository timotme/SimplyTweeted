<script lang="ts">
  export let title: string = "No Items Found";
  export let message: string = "There are no items to display.";
  export let actionLink: string | null = null;
  export let actionText: string | null = null;
</script>

<div class="card bg-base-200 shadow-lg">
  <div class="card-body items-center text-center py-12">
    <svg class="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-14a2 2 0 00-2 2v1a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
    </svg>
    <h3 class="mt-4 text-xl font-medium">{title}</h3>
    <p class="mt-1 text-sm">{message}</p>
    {#if actionLink && actionText}
      <div class="mt-6">
        <a href={actionLink} class="btn btn-primary">
          {actionText}
        </a>
      </div>
    {/if}
  </div>
</div> 
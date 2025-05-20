<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;
  export let basePath: string;
</script>

{#if totalPages > 1}
  <div class="mt-8 flex justify-center items-center space-x-2">
    {#if currentPage > 1}
      <a href="{basePath}?page={currentPage - 1}" 
         class="btn btn-outline btn-sm">
        Previous
      </a>
    {/if}

    {#each Array(totalPages) as _, i}
      {@const pageNum = i + 1}
      <a href="{basePath}?page={pageNum}" 
         class="btn btn-sm {pageNum === currentPage ? 'btn-primary' : 'btn-outline'}"
      >
        {pageNum}
      </a>
    {/each}

    {#if currentPage < totalPages}
      <a href="{basePath}?page={currentPage + 1}" 
         class="btn btn-outline btn-sm">
        Next
      </a>
    {/if}
  </div>
{/if} 
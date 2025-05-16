<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-4xl font-bold text-error">Authentication Error</h1>
            <p class="py-6">
                {#if $page.url.searchParams.get('error') === 'AccessDenied'}
                    Your account is not authorized to use this application.
                {:else}
                    There was an error during authentication. Please try again.
                {/if}
            </p>
            <a href="/" class="btn btn-primary">Return to Home</a>
        </div>
    </div>
</div> 
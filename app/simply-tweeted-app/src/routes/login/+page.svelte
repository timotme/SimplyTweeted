<script lang="ts">
       import { SignIn } from "@auth/sveltekit/components"
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold mb-6">Simply Tweeted</h1>
			<p class="py-6">Schedule your tweets with ease. Login to get started.</p>
			<SignIn provider="twitter" signInPage="signin" />
		</div>
	</div>
</div> 
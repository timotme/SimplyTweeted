<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="container mx-auto p-6">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">Welcome, {$page.data.session?.user?.name || 'User'}!</h2>
			<p>This is your tweet scheduling dashboard.</p>
			
			<div class="divider"></div>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="card bg-base-200">
					<div class="card-body">
						<h3 class="card-title">Schedule New Tweet</h3>
						<p>Create and schedule your next tweet.</p>
						<div class="card-actions justify-end">
							<button class="btn btn-primary">Create Tweet</button>
						</div>
					</div>
				</div>
				
				<div class="card bg-base-200">
					<div class="card-body">
						<h3 class="card-title">Your Scheduled Tweets</h3>
						<p>View and manage your upcoming tweets.</p>
						<div class="card-actions justify-end">
							<button class="btn btn-primary">View All</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div> 
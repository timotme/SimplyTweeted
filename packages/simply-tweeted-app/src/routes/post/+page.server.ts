import { redirect, fail } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { dbClient } from '$lib/server/db';
import { TweetStatus, type Tweet } from 'shared-lib';

export const load = async (event: RequestEvent) => {
	const session = await event.locals.auth();
	
	if (!session) {
		throw redirect(303, '/login');
	}
	
	return {
		session
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const session = await locals.auth();
		
		if (!session || !session.user) {
			throw redirect(303, '/login');
		}
		
		const formData = await request.formData();
		const content = formData.get('content') as string;
		const scheduledDate = formData.get('scheduledDate') as string;
		const scheduledTime = formData.get('scheduledTime') as string;
		const community = formData.get('community') as string;
		
		// Validation
		if (!content || content.trim() === '') {
			return fail(400, { content, error: 'Tweet content is required' });
		}
		
		if (content.length > 280) {
			return fail(400, { content, error: 'Tweet content must be 280 characters or less' });
		}
		
		if (!scheduledDate || !scheduledTime) {
			return fail(400, { content, error: 'Date and time are required' });
		}
		
		// Combine date and time into a single Date object
		const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
		
		// Check if the scheduled time is in the past
		if (scheduledDateTime < new Date()) {
			return fail(400, { content, error: 'Scheduled time must be in the future' });
		}
		
		let success = false;
		try {
			const tweet: Tweet = {
				userId: session.user.id as string,
				content,
				scheduledDate: scheduledDateTime,
				community,
				status: TweetStatus.SCHEDULED,
				createdAt: new Date()
			};
			
			await dbClient.saveTweet(tweet);
			success = true;
		} catch (error) {
			console.error('Failed to save tweet:', error);
			return fail(500, { content, error: 'Failed to schedule tweet. Please try again.' });
		}

		redirect(303, '/dashboard');
	}
}; 
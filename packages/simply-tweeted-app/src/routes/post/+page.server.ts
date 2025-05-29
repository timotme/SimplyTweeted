import { redirect, fail } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { getDbInstance } from '$lib/server/db';
import { TweetStatus, type Tweet } from 'shared-lib';
import { fromZonedTime } from 'date-fns-tz';

// Helper function to convert local time to UTC
function convertToUTC(date: string, time: string, timezone: string): Date {
	try {
		// If no timezone provided, treat as UTC
		if (!timezone) {
			return new Date(`${date}T${time}:00.000Z`);
		}
		
		// Create the local datetime string
		const localDateTime = `${date} ${time}:00`;
		
		// Use date-fns-tz to convert the user's local time to UTC
		// This handles all timezone complexities including DST automatically
		const utcDate = fromZonedTime(localDateTime, timezone);
		
		return utcDate;
		
	} catch (error) {
		console.error('Error converting timezone:', error, 'for timezone:', timezone);
		// Fallback: treat as UTC if timezone conversion fails
		return new Date(`${date}T${time}:00.000Z`);
	}
}

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
		const timezone = formData.get('timezone') as string;
		
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
		
		// Convert the local time to UTC using the user's timezone
		const scheduledDateTime = convertToUTC(scheduledDate, scheduledTime, timezone);
		
		// Check if the scheduled time is in the past (compare with current UTC time)
		if (scheduledDateTime < new Date()) {
			return fail(400, { content, error: 'Scheduled time must be in the future' });
		}
		
		let success = false;
		try {
			const tweet: Tweet = {
				userId: session.user.id as string,
				content,
				scheduledDate: scheduledDateTime, // This is now properly in UTC
				community,
				status: TweetStatus.SCHEDULED,
				createdAt: new Date() // This is also UTC
			};
			
			await getDbInstance().saveTweet(tweet);
			success = true;
		} catch (error) {
			console.error('Failed to save tweet:', error);
			return fail(500, { content, error: 'Failed to schedule tweet. Please try again.' });
		}

		redirect(303, '/scheduled');
	}
}; 
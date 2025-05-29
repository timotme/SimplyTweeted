import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDbInstance } from '$lib/server/db';
import { TweetStatus } from 'shared-lib';
import { log } from '$lib/server/logger.js';

const TWEETS_PER_PAGE = 10;

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		throw redirect(303, '/signin');
	}
	const userId = session.user.id;

	const page = parseInt(url.searchParams.get('page') || '1');

	try {
		// Use the generic utility functions from db for cleaner code
		const [tweets, totalTweets] = await Promise.all([
			getDbInstance().getTweets(userId, page, TWEETS_PER_PAGE, TweetStatus.SCHEDULED, 1),
			getDbInstance().countTweets(userId, TweetStatus.SCHEDULED)
		]);

		return {
			tweets,
			currentPage: page,
			totalPages: Math.ceil(totalTweets / TWEETS_PER_PAGE),
			session
		};
	} catch (error) {
		log.error("Error loading scheduled tweets:", { userId, page, error });
		return fail(500, { error: "Failed to load scheduled tweets." });
	}
};

export const actions: Actions = {
	deleteTweet: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) {
			return fail(401, { error: 'Unauthorized' });
		}
		const userId = session.user.id;

		const formData = await request.formData();
		const tweetId = formData.get('tweetId')?.toString();

		if (!tweetId) {
			return fail(400, { error: 'Tweet ID is required' });
		}

		try {
			const result = await getDbInstance().deleteTweet(tweetId, userId);
			
			if (!result.success) {
				return fail(404, { error: 'Tweet not found or you do not have permission to delete it' });
			}

			return { success: true, deletedTweetId: tweetId };
		} catch (error) {
			log.error('Error deleting tweet:', { userId, tweetId, error });
			
			// Check if it's an invalid ObjectId error
			if (error instanceof Error && error.message.includes('ObjectId')) {
				return fail(400, { error: 'Invalid Tweet ID format' });
			}
			
			return fail(500, { error: 'Failed to delete tweet' });
		}
	}
}; 
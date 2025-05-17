import { error, fail, redirect } from '@sveltejs/kit';
import { dbClient } from '$lib/server/db';
import { TweetStatus } from 'shared-lib';

const TWEETS_PER_PAGE = 10;

export const load = (async ({ locals, url }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		throw redirect(303, '/signin');
	}
	const userId = session.user.id;
	const page = Number(url.searchParams.get('page')) || 1;

	try {
		// Use the generic utility functions from dbClient
		const [tweets, totalTweets] = await Promise.all([
			dbClient.getTweets(userId, page, TWEETS_PER_PAGE, [TweetStatus.POSTED, TweetStatus.FAILED], -1),
			dbClient.countTweets(userId, [TweetStatus.POSTED, TweetStatus.FAILED])
		]);

		return {
			tweets,
			currentPage: page,
			totalPages: Math.ceil(totalTweets / TWEETS_PER_PAGE),
			session
		};
	} catch (err) {
		console.error('Error fetching tweet history:', err);
		throw error(500, 'Failed to load tweets');
	}
});

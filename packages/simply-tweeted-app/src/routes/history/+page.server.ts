import { error, redirect } from '@sveltejs/kit';
import { getDbInstance } from '$lib/server/db';
import { TweetStatus } from 'shared-lib';
import { log } from '$lib/server/logger.js';

const TWEETS_PER_PAGE = 10;

export const load = (async ({ locals, url }) => {
	const session = await locals.auth();
	if (!session?.user?.id) {
		throw redirect(303, '/signin');
	}
	const userId = session.user.id;
	const page = Number(url.searchParams.get('page')) || 1;

	try {
		const [tweets, totalTweets] = await Promise.all([
			getDbInstance().getTweets(userId, page, TWEETS_PER_PAGE, [TweetStatus.POSTED, TweetStatus.FAILED], -1),
			getDbInstance().countTweets(userId, [TweetStatus.POSTED, TweetStatus.FAILED])
		]);

		return {
			tweets,
			currentPage: page,
			totalPages: Math.ceil(totalTweets / TWEETS_PER_PAGE),
			session
		};
	} catch (err) {
		log.error('Error fetching tweet history:', { userId, page, error: err });
		throw error(500, 'Failed to load tweets');
	}
});

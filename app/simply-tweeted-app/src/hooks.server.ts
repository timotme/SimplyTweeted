import type { HandleServerError } from '@sveltejs/kit';

export { handle } from "./auth"

export const handleError: HandleServerError = async ({ error, event }) => {
	console.error('Error caught in handleError:', error);
	console.error('Event associated with the error:', event);

	// Optionally, you can return a custom error response
	return {
		message: 'Whoops!',
		// You can include a unique error ID for tracking, etc.
		// errorId: generateRandomId(),
	};
};
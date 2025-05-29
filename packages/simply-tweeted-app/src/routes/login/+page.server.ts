import { signIn } from "../../auth"
import type { Actions } from "./$types"
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	
	if (session) {
		throw redirect(303, '/dashboard');
	}
	
	return {};
};

export const actions: Actions = { default: signIn }

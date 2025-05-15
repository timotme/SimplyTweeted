// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Promise<import('@auth/sveltekit').Session | null>;
		}
		interface PageData {
			session: import('@auth/sveltekit').Session | null;
		}
		// interface Platform {}
	}
}

export {};

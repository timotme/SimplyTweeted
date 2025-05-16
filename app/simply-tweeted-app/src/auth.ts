import { SvelteKitAuth } from "@auth/sveltekit"
import Twitter from "@auth/sveltekit/providers/twitter"
import { ALLOWED_TWITTER_ACCOUNTS } from "$env/static/private";
 
// List of allowed Twitter account usernames/IDs
const allowedAccounts = ALLOWED_TWITTER_ACCOUNTS.split(',').map(account => account.trim());

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [Twitter],
  callbacks: {
    async signIn({ account, profile }) {

      if (account?.provider === 'twitter') {
        const twitterUsername = (profile?.data as { username: string })?.username || '';
        // Allow if the Twitter username or ID is in our allowed list
        return allowedAccounts.includes(twitterUsername)
      }
      
      // Deny other providers by default
      return false;
    },
  }
}) 
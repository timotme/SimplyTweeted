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
        // Ensure profile and profile.data exist
        if (profile && 'data' in profile) {
          const twitterProfile = profile.data as { username: string; id: string };
          const twitterUsername = twitterProfile?.username || '';
          // Allow if the Twitter username is in our allowed list
          return allowedAccounts.includes(twitterUsername);
        }
        // If profile.data is not as expected, deny sign-in
        return false;
      }
      // Deny other providers by default
      return false;
    },
    // async jwt({ token, account, profile }) {
    //   // Persist the user id to the token right after signin
    //   if (account && profile && 'data' in profile) {
    //     // It's important to check the provider here if you have multiple.
    //     if (account.provider === 'twitter') {
    //       const twitterProfile = profile.data as { id: string; username: string };
    //       token.userId = twitterProfile.id; // Store the stable Twitter ID
    //       token.twitterUsername = twitterProfile.username; // Optionally store username
    //     }
    //   }
    //   return token;
    // },
    // async session({ session, token, user }) {
    //   // Send properties to the client, like user id from a provider.
    //   if (session.user) {
    //     if (token.userId) {
    //       (session.user as { id: string }).id = token.userId as string;
    //     }
    //     if (token.twitterUsername) {
    //       (session.user as { username?: string }).username = token.twitterUsername as string;
    //     }
    //   }
    //   return session;
    // }
  }
}) 
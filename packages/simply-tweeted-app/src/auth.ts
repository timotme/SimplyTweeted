import { SvelteKitAuth } from "@auth/sveltekit"
import Twitter from "@auth/sveltekit/providers/twitter"
import { ALLOWED_TWITTER_ACCOUNTS, AUTH_TWITTER_ID, AUTH_TWITTER_SECRET, AUTH_TRUST_HOST } from '$lib/server/env';
import { getDbInstance } from '$lib/server/db';
import type { UserAccount } from 'shared-lib';
 
// List of allowed Twitter account usernames/IDs
const allowedAccounts = ALLOWED_TWITTER_ACCOUNTS.split(',').map((account: string) => account.trim());

export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: AUTH_TRUST_HOST === 'true',
  providers: [
    Twitter({
      clientId: AUTH_TWITTER_ID,
      clientSecret: AUTH_TWITTER_SECRET,
      authorization: {
        url: "https://x.com/i/oauth2/authorize",
        params: { 
          scope: "tweet.read tweet.write users.read offline.access" 
        }
      }
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'twitter') {
        // Ensure profile and profile.data exist
        if (profile && 'data' in profile) {
          const twitterProfile = profile.data as { username: string; id: string };
          const twitterUsername = twitterProfile?.username || '';
          
          // Allow if the Twitter username is in our allowed list
          const isAllowed = allowedAccounts.includes(twitterUsername);
          
          if (isAllowed && account) {
            // Save the user credentials to the database
            const userAccount: UserAccount = {
              userId: twitterProfile.id,
              username: twitterUsername,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token || '',
              refresh_token: account.refresh_token || '',
              expires_at: account.expires_at || 0,
              expires_in: account.expires_in || 0,
              token_type: account.token_type || 'bearer',
              scope: account.scope || '',
              createdAt: new Date()
            };
            
            // Save to database
            await getDbInstance().saveUserAccount(userAccount);
          }
          
          return isAllowed;
        }
        // If profile.data is not as expected, deny sign-in
        return false;
      }
      // Deny other providers by default
      return false;
    },
    async jwt({ token, account, profile }) {
      // Persist the user id to the token right after signin
      if (account && profile && 'data' in profile) {
        // It's important to check the provider here if you have multiple.
        if (account.provider === 'twitter') {
          const twitterProfile = profile.data as { id: string; username: string };
          token.userId = twitterProfile.id; // Store the stable Twitter ID
          token.twitterUsername = twitterProfile.username; // Optionally store username
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like user id from a provider.
      if (session.user) {
        if (token.userId) {
          (session.user as { id: string }).id = token.userId as string;
        }
        if (token.twitterUsername) {
          (session.user as { username?: string }).username = token.twitterUsername as string;
        }
      }
      return session;
    }
  }
}) 
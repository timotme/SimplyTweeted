
import { SvelteKitAuth } from "@auth/sveltekit"
import Twitter from "@auth/sveltekit/providers/twitter"
 
export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [Twitter],
}) 
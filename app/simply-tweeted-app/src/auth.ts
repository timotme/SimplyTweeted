
import { SvelteKitAuth } from "@auth/sveltekit"
import Twitter from "@auth/sveltekit/providers/twitter"
 
export const { handle, signIn } = SvelteKitAuth({
  providers: [Twitter],
}) 
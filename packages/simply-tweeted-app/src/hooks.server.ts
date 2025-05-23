import type { ServerInit } from "@sveltejs/kit";
import { initializeDatabase } from "$lib/server/db";

export { handle } from "./auth"
export const init: ServerInit = async () => {
	await initializeDatabase();
};
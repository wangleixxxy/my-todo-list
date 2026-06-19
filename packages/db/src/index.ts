import { env } from "@my-todo-list/env/server";
import { drizzle } from "drizzle-orm/neon-http";

import {
	account,
	accountRelations,
	session,
	sessionRelations,
	todos,
	user,
	userRelations,
	verification,
} from "./schema";

const schema = {
	account,
	accountRelations,
	session,
	sessionRelations,
	todos,
	user,
	userRelations,
	verification,
};

export function createDb() {
	return drizzle(env.DATABASE_URL, { schema });
}

export const db = createDb();

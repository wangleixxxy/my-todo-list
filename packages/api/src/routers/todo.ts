import { db } from "@my-todo-list/db";
import { todos } from "@my-todo-list/db/schema/index";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure, router } from "../index";

export const todoRouter = router({
	getAll: publicProcedure.query(async () =>
		db.select().from(todos).orderBy(todos.createdAt)
	),

	create: publicProcedure
		.input(
			z.object({
				title: z.string().min(1).max(50).trim(),
			})
		)
		.mutation(async ({ input }) => {
			const [todo] = await db
				.insert(todos)
				.values({ title: input.title })
				.returning();
			if (!todo) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create todo",
				});
			}
			return todo;
		}),

	toggle: publicProcedure
		.input(
			z.object({
				id: z.string(),
				completed: z.boolean(),
			})
		)
		.mutation(async ({ input }) => {
			const [todo] = await db
				.update(todos)
				.set({ completed: input.completed })
				.where(eq(todos.id, input.id))
				.returning();
			if (!todo) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
			}
			return todo;
		}),

	delete: publicProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const [todo] = await db
				.delete(todos)
				.where(eq(todos.id, input.id))
				.returning();
			if (!todo) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
			}
			return { id: todo.id };
		}),
});

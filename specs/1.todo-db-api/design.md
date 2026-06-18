# todo-db-api — 技术设计

## 设计版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-06-18 | v1   | 初始设计 |

## 项目架构

- 架构类型: turborepo-monorepo
- 涉及层: 数据库层（packages/db）、tRPC 路由层（packages/api）

## 功能模块设计

### 模块 1: todos Drizzle Schema

**数据库层（packages/db/src/schema/todo.ts）**

```ts
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

- ID 使用 `text` + `crypto.randomUUID()`，与项目现有 auth schema 保持一致
- 在 `packages/db/src/schema/index.ts` 追加 `export * from "./todo"`
- 执行命令：`pnpm db:generate` → 检查 migration 文件 → `pnpm db:migrate`

### 模块 2: todos tRPC Router

**tRPC 路由层（packages/api/src/routers/todo.ts）**

4 个 procedure，全部使用 `publicProcedure`（V1.0 无登录）：

| procedure | 类型 | input | output |
| --------- | ---- | ----- | ------ |
| `todo.getAll` | query | 无 | `Todo[]` |
| `todo.create` | mutation | `{ title: string }` | `Todo` |
| `todo.toggle` | mutation | `{ id: string, completed: boolean }` | `Todo` |
| `todo.delete` | mutation | `{ id: string }` | `{ id: string }` |

**在 `packages/api/src/routers/index.ts` 注册 todoRouter：**

```ts
import { todoRouter } from "./todo";

export const appRouter = router({
  // 已有路由...
  todo: todoRouter,
});
```

## 接口契约

```ts
// todo.getAll
// input: 无
// output: { id: string; title: string; completed: boolean; createdAt: Date }[]

// todo.create
// input: { title: string }  // z.string().min(1).max(50).trim()
// output: { id: string; title: string; completed: boolean; createdAt: Date }

// todo.toggle
// input: { id: string; completed: boolean }
// output: { id: string; title: string; completed: boolean; createdAt: Date }
// error: NOT_FOUND 如果 id 不存在

// todo.delete
// input: { id: string }
// output: { id: string }
// error: NOT_FOUND 如果 id 不存在
```

## 数据模型

```sql
CREATE TABLE "todos" (
  "id" text PRIMARY KEY,
  "title" text NOT NULL,
  "completed" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);
```

## 安全考虑

- 所有 procedure 为 `publicProcedure`，V1.0 不做用户鉴权（符合 PRD 设计）
- `title` input 须 Zod 校验：非空、trim、最大 50 字符
- `toggle` 和 `delete` 须校验任务是否存在，不存在时抛 `TRPCError({ code: "NOT_FOUND" })`

## 技术决策

| 决策 | 选择 | 理由 |
| ---- | ---- | ---- |
| ID 生成 | `crypto.randomUUID()` | 与项目现有 auth schema 保持一致，无需额外依赖 |
| 分页 | 不做 | V1.0 任务量小，PRD 明确返回全部 |
| 筛选接口 | 不做 | PRD 明确筛选在前端完成 |

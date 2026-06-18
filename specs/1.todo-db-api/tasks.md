# todo-db-api — 任务清单

## 任务版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-06-18 | v1   | 初始任务 |

## 项目信息

- 项目名: my-todo-list
- 架构类型: turborepo-monorepo
- specs 路径: specs/1.todo-db-api/

## 任务列表

### 数据库层（packages/db）

- [x] T-001: 新增 `packages/db/src/schema/todo.ts`，定义 todos 表（id/title/completed/createdAt），并在 schema/index.ts 追加导出 ~15min
- [x] T-002: 执行 `pnpm db:generate`，检查生成的 migration 文件，再执行 `pnpm db:migrate` ~5min

### tRPC 路由层（packages/api）

- [x] T-003: 新增 `packages/api/src/routers/todo.ts`，实现 `todo.getAll` query（返回全部 todos） ~15min
- [x] T-004: 在同文件实现 `todo.create` mutation（input: title，Zod 校验非空/trim/max50，返回新建 todo） ~15min
- [x] T-005: 在同文件实现 `todo.toggle` mutation（input: id+completed，id 不存在抛 NOT_FOUND，返回更新后 todo） ~15min
- [x] T-006: 在同文件实现 `todo.delete` mutation（input: id，id 不存在抛 NOT_FOUND，返回 {id}），并在 routers/index.ts 注册 todoRouter ~15min

## 依赖关系

- T-002 依赖 T-001（schema 需先定义再 generate）
- T-003/T-004/T-005/T-006 依赖 T-002（DB 需先 migrate，Drizzle client 类型才完整）
- T-004/T-005/T-006 可在 T-003 完成后并行开发（同一文件内顺序实现即可）

## 风险点

- `pnpm db:migrate` 需要本地 PostgreSQL 运行且 DATABASE_URL 已配置，执行前确认 `.env` 存在
- `crypto.randomUUID()` 在 Node.js 18+ 可用，确认 server 运行时版本

# 变更日志 — 2026-06-19

## Feature 1: todo-db-api

### 新增

- `todos` 表（Drizzle schema + PostgreSQL migration）
- tRPC router `todo.*` 含 4 个 procedure：`getAll` / `create` / `toggle` / `delete`
- `packages/api` 新增 `drizzle-orm` 直接依赖（用于 `eq` 等查询帮助函数）

### 关键文件

- `packages/db/src/schema/todo.ts` — todos 表定义（text id + crypto.randomUUID()）
- `packages/db/src/migrations/0000_true_gorilla_man.sql` — 初始 migration（含所有表）
- `packages/api/src/routers/todo.ts` — 4 个 publicProcedure，Zod 输入校验，NOT_FOUND 错误处理
- `packages/api/src/routers/index.ts` — 注册 `todo: todoRouter`

### 架构决策

- ID 使用 `text` + `crypto.randomUUID()`，与 Better Auth auth schema 保持一致
- 全部使用 `publicProcedure`（V1.0 无需登录）
- 筛选逻辑不放在接口层，由前端完成

---

## Feature 2: todo-frontend

### 新增

- 移动端 Todo 页面（`apps/web/src/routes/index.tsx` 完整重写）
- TitleBar：标题 + 未完成任务数统计
- TodoInput：TanStack Form + Zod 校验，提交成功后重置
- TodoFilter：全部 / 未完成 / 已完成三 Tab，前端过滤
- TodoList：Skeleton 加载态 / 错误态（含重载按钮）/ 空态（筛选感知文案）
- TodoItem：Checkbox 切换 + 删除线 + createdAt 本地时间 + 删除触发
- DeleteConfirm：`fixed bottom-0` 弹层，取消 / 确认删除

### 关键文件

- `apps/web/src/routes/index.tsx` — 全量重写，单文件包含所有组件

### 架构决策

- 所有组件内联在 `index.tsx`，避免过早拆分（V1.0 规模）
- `invalidateQueries` 保持数据一致性，不做乐观更新
- 错误由 `QueryCache.onError` 全局处理（sonner toast），组件内不重复
- `pendingDeleteId` 状态在页面级管理，弹层与列表项解耦

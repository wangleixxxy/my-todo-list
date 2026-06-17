---
description: packages/db 数据库开发约定（Drizzle ORM + PostgreSQL）
globs: packages/db/**
---

# Database

## Schema

- Schema 文件放在 `packages/db/src/schema/`，按业务模块拆分（如 `auth.ts`、`todo.ts`）
- 在 `packages/db/src/schema/index.ts` 统一导出所有 schema
- ID 字段使用 `text` 类型（与 Better Auth 保持一致，不用 serial 或 uuid()）
- 关联关系用 `relations()` 定义，不手动拼 join 字符串
- 外键上的级联删除写在 `references()` 的第二个参数：`{ onDelete: "cascade" }`

## Migration 工作流

```
修改 schema → pnpm db:generate → 检查生成的 migration 文件 → pnpm db:migrate
```

- `db:push`：跳过 migration 文件直接同步 schema，仅用于本地开发快速验证
- `db:generate`：根据 schema 变更生成 migration 文件，产物在 `packages/db/src/migrations/`
- `db:migrate`：执行 migration 文件，生产环境变更必须走这条路
- `db:studio`：打开 Drizzle Studio 可视化查看数据

**不得跳过 `db:generate` 直接 `db:migrate`**，也不得在生产环境用 `db:push`。

## 查询

- 使用 Drizzle 查询 API（`db.select()`、`db.insert()`、`db.update()`、`db.delete()`）
- 禁止裸 SQL 字符串，有注入风险
- 多表写操作包在 `db.transaction()` 内

## 配置

- `drizzle.config.ts` 通过 `dotenv` 读取 `apps/server/.env` 中的 `DATABASE_URL`
- 数据库 client 在 `packages/db/src/index.ts` 的 `createDb()` 导出

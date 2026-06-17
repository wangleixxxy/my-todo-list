---
description: Turborepo monorepo workspace 协作约定
---

# Monorepo

## Workspace 结构

```
apps/
  web/        — React SPA（Vite）
  server/     — Hono HTTP 服务端
  fumadocs/   — 文档站（Next.js）
packages/
  api/        — tRPC router 定义（前后端共享类型）
  auth/       — Better Auth 配置（前后端共享）
  db/         — Drizzle schema + 数据库 client
  ui/         — shadcn 组件库
  env/        — Zod 环境变量校验
  config/     — 共享 tsconfig / biome 基础配置
```

## 依赖约定

- 内部包依赖一律写 `"workspace:*"`，不写具体版本号
- 共享的第三方依赖通过 `pnpm-workspace.yaml` 的 `catalog:` 统一管理版本，单个包使用 `"catalog:"` 引用
- 新增内部包依赖后需重启 `turbo dev`（turbo 不会自动感知 package.json 变化）

## Turbo 任务规则

- `build`：依赖上游 `^build`，先构建 packages/ 再构建 apps/，产物在 `dist/`
- `check-types`：依赖上游 `^check-types`，packages/ 类型必须先通过
- `dev`：不缓存、persistent，直接跑各 app 的 dev server
- `db:*`：全部不缓存，直接操作数据库

过滤单个包：`turbo -F <name> <task>`，`<name>` 取各包 `package.json` 的 `name` 字段（如 `-F web`、`-F @my-todo-list/db`）。

## 跨包修改注意事项

- 修改 `packages/api`（tRPC router/types）后，`apps/web` 的类型自动更新（无需重启，Vite 会感知）
- 修改 `packages/db`（schema）后必须执行 `pnpm db:generate` 生成 migration
- 修改 `packages/env` 后，所有依赖它的 app 都受影响，本地需更新 `.env`
- 修改 `packages/config`（tsconfig）后建议重启 TS server
- 禁止在 `packages/` 之间产生循环依赖

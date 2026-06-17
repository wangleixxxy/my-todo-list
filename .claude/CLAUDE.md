# my-todo-list

基于 Better-T-Stack 搭建的全栈 TypeScript monorepo，包含 React SPA 前端、Hono 后端、tRPC 类型安全 API 和 Drizzle + PostgreSQL 数据库。

## 技术栈

- 语言: TypeScript strict + noUncheckedIndexedAccess
- 包管理: pnpm + Turborepo monorepo
- 前端: React 19 + Vite + TanStack Router（文件式路由）+ TanStack Query + tRPC + Tailwind CSS v4
- 后端: Hono + tRPC + Better Auth
- 数据库: Drizzle ORM + PostgreSQL
- 组件库: shadcn/ui（packages/ui）
- 代码规范: Biome（Ultracite preset）

## 目录结构

```
apps/
  web/        — React SPA 前端
  server/     — Hono HTTP 服务端（端口 3000）
  fumadocs/   — 文档站
packages/
  api/        — tRPC router 定义（publicProcedure / protectedProcedure）
  auth/       — Better Auth 配置（emailAndPassword 已启用）
  db/         — Drizzle schema + 数据库 client
  ui/         — shadcn 组件库
  env/        — Zod 环境变量校验（server.ts / web.ts）
  config/     — 共享 tsconfig / biome 基础配置
```

## 常用命令

- 全量开发: `pnpm dev`
- 仅前端: `turbo -F web dev`
- 仅后端: `turbo -F server dev`
- 构建: `pnpm build`
- 类型检查: `pnpm check-types`
- Lint 检查: `pnpm check`
- Lint 修复: `pnpm fix`
- DB 同步（开发）: `pnpm db:push`
- DB 生成 migration: `pnpm db:generate`
- DB 执行 migration: `pnpm db:migrate`
- DB Studio: `pnpm db:studio`

## 规则

@rules/coding-style.md
@rules/testing.md
@rules/security.md
@rules/git-workflow.md
@rules/monorepo.md
@rules/frontend.md
@rules/backend-api.md
@rules/database.md

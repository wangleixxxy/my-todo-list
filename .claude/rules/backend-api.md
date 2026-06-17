---
description: packages/api 和 apps/server 后端开发约定（tRPC + Hono + Better Auth）
globs: packages/api/**, apps/server/**
---

# Backend API

## 职责划分

- **`packages/api/`** — 所有业务逻辑在这里，tRPC router、procedure、context 定义
- **`apps/server/`** — 只做挂载：注册 Hono 中间件、挂载 tRPC adapter 和 Better Auth handler，不写业务逻辑

## tRPC Procedure

两种 procedure，从 `packages/api/src/index.ts` 导入：

| procedure | 鉴权 | 说明 |
| --------- | ---- | ---- |
| `publicProcedure` | 无 | 任何人可访问 |
| `protectedProcedure` | session 必须存在 | session 为空时自动抛 `UNAUTHORIZED` |

- 所有 procedure 的 `input` 必须有 Zod schema，禁止 `z.any()`
- 错误用 `TRPCError` 抛出，附带明确的 `code`（如 `NOT_FOUND`、`BAD_REQUEST`）和 `message`
- Router 按功能模块拆分文件，放在 `packages/api/src/routers/` 下，在 `routers/index.ts` 汇总

## Context

`createContext` 在 `packages/api/src/context.ts`，返回 `{ auth: null, session }`：

- `session`：来自 Better Auth 的 `auth.api.getSession()`，未登录时为 `null`
- 在 `protectedProcedure` 内 `ctx.session` 已保证非空，可直接访问 `ctx.session.user`

## Hono 中间件顺序（apps/server）

```
logger() → cors() → /api/auth/* (Better Auth) → /trpc/* (tRPC adapter)
```

- cors：允许 GET/POST/OPTIONS，`credentials: true`，origin 来自 `env.CORS_ORIGIN`
- tRPC endpoint：`/trpc/*`
- Auth endpoint：`/api/auth/*`，由 Better Auth 处理，不要在这个路径上加其他逻辑

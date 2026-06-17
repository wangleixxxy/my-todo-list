---
description: 安全禁区与敏感数据处理规范
---

# Security

## 环境变量

所有环境变量必须在 `packages/env` 中用 Zod schema 定义，**禁止直接读 `process.env`**：

- 服务端变量 → `packages/env/src/server.ts`，通过 `@t3-oss/env-core` 的 `createEnv` 校验
- 客户端变量 → `packages/env/src/web.ts`，变量名必须以 `VITE_` 开头

当前已定义的环境变量：

| 变量 | 位置 | 约束 |
| ---- | ---- | ---- |
| `DATABASE_URL` | server | 非空字符串 |
| `BETTER_AUTH_SECRET` | server | 最少 32 字符 |
| `BETTER_AUTH_URL` | server | 合法 URL |
| `CORS_ORIGIN` | server | 合法 URL |
| `NODE_ENV` | server | development / production / test |
| `VITE_SERVER_URL` | client | 合法 URL |

新增环境变量：先在 `packages/env` 对应文件加 Zod 字段，再在 `.env` 中填值，**不能反过来**。

## 禁止事项

- 禁止硬编码任何密钥、token、数据库连接串
- `.env`、`.env*.local` 已在 `.gitignore`，不得强制 commit
- 禁止在前端代码中暴露服务端环境变量（无 `VITE_` 前缀的变量不会被 Vite 注入）

## 认证 & Cookie

Better Auth 已配置：`httpOnly: true`、`secure: true`、`sameSite: "none"`。不得在前端读取或修改 auth cookie，认证状态通过 tRPC session 获取。

## tRPC 鉴权

需要登录的接口必须用 `protectedProcedure`（内部自动校验 session，session 为空时抛 `UNAUTHORIZED`）。禁止在 `publicProcedure` 内手动做 session 判断。

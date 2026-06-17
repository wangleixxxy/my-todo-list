---
description: apps/web 前端开发约定（React + Vite + TanStack Router + tRPC）
globs: apps/web/**
---

# Frontend

## 路由（TanStack Router）

- 文件式路由，路由文件放在 `apps/web/src/routes/`，文件名即 URL 路径
- 用 `createFileRoute` 定义路由组件，根路由用 `createRootRouteWithContext`
- 受保护路由放在 `_auth/` 目录下（route group），`_auth/route.tsx` 负责鉴权守卫
- RouterAppContext 包含 `trpc`（tRPC proxy）和 `queryClient`，通过 `Route.useRouteContext()` 取用
- 路由树自动生成文件：`src/routeTree.gen.ts`（已在 `.gitignore`，不要手动修改）

## 数据获取（tRPC + TanStack Query）

```ts
// 查询
const data = useQuery(trpc.procedureName.queryOptions())

// 变更
const mutation = useMutation(trpc.procedureName.mutationOptions())
```

- tRPC client 在 `src/utils/trpc.ts` 统一配置，使用 `httpBatchLink`，`credentials: "include"`
- tRPC 错误自动通过 `sonner` toast 展示（在 `QueryCache.onError` 中处理），组件内无需重复处理网络错误

## 组件

- 优先使用 `packages/ui` 中的 shadcn 组件：`import { Button } from "@my-todo-list/ui/components/button"`
- 不在 `apps/web` 内重复实现基础 UI 组件

## 认证

- 使用 `src/lib/auth-client.ts` 中导出的 Better Auth client，不直接 fetch `/api/auth/*`
- session 数据通过 tRPC context 或 auth client 的响应式接口获取

## 样式

- Tailwind CSS v4，使用 utility class，禁止内联 `style` 属性
- 类名排序由 Biome `useSortedClasses` 处理，`cn()`/`clsx()`/`cva()` 内自动排序

## 环境变量

- 只用 `VITE_` 前缀的变量
- 通过 `@my-todo-list/env/web` 导出的 `env` 对象读取，不直接访问 `import.meta.env`

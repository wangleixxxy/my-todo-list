# my-todo-list

基于 [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) 构建的移动端 Todo 应用，全栈 TypeScript Turborepo monorepo。

## 功能

- 添加、删除、完成待办任务
- 按"全部 / 未完成 / 已完成"筛选任务
- 移动端友好的交互体验（删除二次确认底部弹层）

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TanStack Router + TanStack Query + TanStack Form + Tailwind CSS v4 |
| 后端 | Hono + tRPC + Better Auth |
| 数据库 | Drizzle ORM + PostgreSQL |
| 组件库 | shadcn/ui（`packages/ui`） |
| Monorepo | Turborepo + pnpm workspaces |
| 代码规范 | Biome（Ultracite preset） |

## 项目结构

```
my-todo-list/
├── apps/
│   ├── web/         # React SPA（端口 5173）
│   └── server/      # Hono HTTP 服务端（端口 3000）
├── packages/
│   ├── api/         # tRPC router（todo.getAll / create / toggle / delete）
│   ├── auth/        # Better Auth 配置
│   ├── db/          # Drizzle schema + migration
│   ├── ui/          # shadcn/ui 共享组件
│   └── env/         # Zod 环境变量校验
```

## 快速开始

### 前置条件

- Node.js 22+（推荐通过 nvm 管理）
- pnpm 11+
- PostgreSQL（本地或 Docker）

### 启动数据库

```bash
docker run -d --name pg-todo \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:16
```

### 安装与配置

```bash
# 切换 Node 版本
nvm use 22

# 安装依赖
pnpm install

# 配置环境变量（复制后按需修改）
cp apps/server/.env.example apps/server/.env
```

`apps/server/.env` 最少配置：

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
BETTER_AUTH_SECRET=your-secret-at-least-32-characters-long
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
```

### 初始化数据库

```bash
pnpm db:generate   # 生成 migration 文件
pnpm db:migrate    # 执行 migration
```

### 启动开发服务器

```bash
pnpm dev
```

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动全部服务 |
| `pnpm build` | 构建全部包 |
| `pnpm check-types` | TypeScript 类型检查 |
| `pnpm check` | Biome lint 检查 |
| `pnpm fix` | Biome 自动修复 |
| `pnpm db:generate` | 生成 migration 文件 |
| `pnpm db:migrate` | 执行 migration |
| `pnpm db:studio` | 打开 Drizzle Studio |

## API 接口（tRPC）

所有接口挂载于 `/trpc`，通过 `trpc.todo.*` 访问：

| Procedure | 类型 | 说明 |
|-----------|------|------|
| `todo.getAll` | query | 获取全部任务，按创建时间升序 |
| `todo.create` | mutation | 新建任务（title 必填，最多 50 字符） |
| `todo.toggle` | mutation | 切换完成状态 |
| `todo.delete` | mutation | 删除任务 |

## UI 组件

共享组件位于 `packages/ui/src/components/`，按如下方式引入：

```tsx
import { Button } from "@my-todo-list/ui/components/button";
```

添加更多 shadcn 组件：

```bash
npx shadcn@latest add <component> -c packages/ui
```

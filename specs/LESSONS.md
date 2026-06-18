# LESSONS.md — 架构决策与踩坑记录

## 2026-06-19 — 1.todo-db-api / T-001 todos schema

**环境坑：Node.js 版本**

Shell 默认 Node.js 为 v18，但项目 pnpm 要求 v22.13+。执行任何 `pnpm` 命令前需先切换：

```bash
source ~/.nvm/nvm.sh && nvm use 22
```

建议在项目根目录添加 `.nvmrc`（内容：`22`）固定版本，避免每次手动切换。

**Biome 配置冲突（预存）**

`apps/fumadocs/biome.json` 存在嵌套 root 配置，导致 `pnpm fix` 全量运行报错。修复方式：

```bash
cd apps/fumadocs && biome migrate --write
```

在此之前，lint 验证需对具体文件单独运行 `npx biome check <file>`。

## 2026-06-19 — 1.todo-db-api / T-002 db:migrate

**环境坑：Docker 容器存在但未启动**

`pnpm db:migrate` 报错时 turbo 会截断真实错误信息，只显示 "applying migrations..." 后退出。直接运行 `node_modules/.bin/drizzle-kit migrate` 同样无法看到详细错误。

排查步骤：先用 `docker ps` 确认 PostgreSQL 容器是否在运行，容器存在但停止时用 `docker start pg-todo` 启动即可。

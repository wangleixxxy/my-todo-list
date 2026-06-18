# todo-db-api — 需求规格

## 概述

为 Todo List 应用提供数据库 schema 和 tRPC 接口层，支持任务的增删改查。

## 项目信息

- 项目名: my-todo-list
- 架构类型: turborepo-monorepo
- 涉及层: 数据库层（packages/db）、tRPC 路由层（packages/api）

## 需求版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-06-18 | v1   | 初始需求 |

## 用户故事

- 作为前端页面，我需要通过 tRPC 获取、创建、更新、删除 Todo 任务，以便展示和操作任务数据。

## 功能需求

1. [F-001] 定义 todos 数据表，包含 id、title、completed、createdAt 字段
2. [F-002] 提供获取全部任务的查询接口（无需登录）
3. [F-003] 提供创建任务的接口，入参为 title，默认 completed 为 false
4. [F-004] 提供切换任务完成状态的接口，入参为 id 和 completed
5. [F-005] 提供删除任务的接口，入参为 id

## 非功能需求

- 安全: 所有接口为公开接口（publicProcedure），V1.0 不做用户隔离
- 性能: 无分页，返回全部任务（V1.0 任务量预期较小）

## 验收标准

- [ ] [AC-001] todos 表已成功 migrate 到数据库，包含全部字段
- [ ] [AC-002] getTodos 返回全部任务数组，字段完整
- [ ] [AC-003] createTodo 创建成功，返回新任务对象，completed 默认为 false
- [ ] [AC-004] toggleTodo 更新成功，返回更新后的任务对象
- [ ] [AC-005] deleteTodo 删除成功，数据库中该任务不再存在
- [ ] [AC-006] 所有 procedure 的 input 均有 Zod 校验

## 依赖

- packages/db：Drizzle ORM + PostgreSQL（已有 createDb 和 auth schema）
- packages/api：tRPC router（已有 publicProcedure 和 protectedProcedure）

## 开放问题

- 无

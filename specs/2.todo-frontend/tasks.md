# todo-frontend — 任务清单

## 任务版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-06-18 | v1   | 初始任务 |

## 项目信息

- 项目名: my-todo-list
- 架构类型: turborepo-monorepo
- specs 路径: specs/2.todo-frontend/

## 任务列表

### 前端层（apps/web）

- [x] T-001: 改写 `apps/web/src/routes/index.tsx`，搭建移动端页面骨架（TitleBar + 容器布局），接入 `trpc.todo.getAll` query，实现加载/错误/空状态 ~30min
- [x] T-002: 实现 `TodoInput` 组件（TanStack Form + Zod 校验，调用 `todo.create` mutation，成功后 invalidate + 清空输入框） ~30min
- [x] T-003: 实现 `TodoFilter` 组件（全部/未完成/已完成 Tab，useState 管理筛选状态，前端过滤列表） ~15min
- [x] T-004: 实现 `TodoItem` 组件（Checkbox 切换状态、标题删除线、createdAt 展示、删除按钮触发确认） ~30min
- [x] T-005: 实现删除确认底部弹层（固定底部，取消/确认，调用 `todo.delete` mutation） ~15min
- [x] T-006: 移动端样式收尾（min-h-11 触控区域、max-w-sm 容器、任务统计数、整体视觉验收） ~15min

## 依赖关系

- 全部 task 依赖 `1.todo-db-api` 全部完成（需要 tRPC 类型）
- T-002/T-003 可在 T-001 完成后并行开发
- T-004 依赖 T-003（需要知道筛选后的列表结构）
- T-005 依赖 T-004（删除触发点在 TodoItem 内）
- T-006 在 T-001～T-005 全部完成后执行

## 风险点

- TanStack Form 与 tRPC mutation 集成时注意 `onSubmit` 的 async 处理，避免重复提交
- `sonner` toast 在 QueryCache.onError 已全局处理错误，组件内无需重复 toast
- 删除确认弹层的 `pendingDeleteId` state 需要在页面级管理，TodoItem 通过 props 回调触发

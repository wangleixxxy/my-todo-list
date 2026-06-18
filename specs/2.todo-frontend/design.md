# todo-frontend — 技术设计

## 设计版本

| 日期       | 版本 | 说明     |
| ---------- | ---- | -------- |
| 2026-06-18 | v1   | 初始设计 |

## 项目架构

- 架构类型: turborepo-monorepo
- 涉及层: 前端层（apps/web）

## 功能模块设计

### 模块 1: 路由与页面骨架

**TanStack Router（apps/web/src/routes/index.tsx 或新增 /todos 路由）**

- 考虑到 PRD 是单页应用，直接在 `apps/web/src/routes/index.tsx` 实现 Todo 页面
- 不放入 `_auth/` 路由组（无需登录）
- 页面布局：移动端容器 `max-w-sm mx-auto`，纵向滚动

页面从上到下结构：
```
<TodoPage>
  <TitleBar />        // 标题 + 未完成任务数
  <TodoInput />       // 输入框 + 添加按钮
  <TodoFilter />      // 全部 / 未完成 / 已完成 Tab
  <TodoList />        // 任务列表 / 加载 / 空 / 错误状态
  <DeleteConfirm />   // 底部确认弹层（条件渲染）
</TodoPage>
```

### 模块 2: 数据获取与 mutations

**TanStack Query + tRPC（apps/web/src/routes/index.tsx 或拆出 hooks）**

```ts
// 查询
const todosQuery = useQuery(trpc.todo.getAll.queryOptions())

// 新增
const createMutation = useMutation(trpc.todo.create.mutationOptions({
  onSuccess: () => queryClient.invalidateQueries(trpc.todo.getAll.pathKey()),
}))

// 切换状态
const toggleMutation = useMutation(trpc.todo.toggle.mutationOptions({
  onSuccess: () => queryClient.invalidateQueries(trpc.todo.getAll.pathKey()),
}))

// 删除
const deleteMutation = useMutation(trpc.todo.delete.mutationOptions({
  onSuccess: () => queryClient.invalidateQueries(trpc.todo.getAll.pathKey()),
}))
```

操作失败时 tRPC 的 QueryCache.onError 已统一用 sonner 展示，无需在组件内重复处理。

### 模块 3: TodoInput 组件

- TanStack Form + Zod（`z.string().min(1).max(50).trim()`）
- 提交成功后调用 `form.reset()` 清空输入框
- 提交中禁用按钮（`createMutation.isPending`）
- 使用 `packages/ui` 的 `Input` 和 `Button` 组件

### 模块 4: TodoFilter 组件

- 筛选状态用 `useState<'all' | 'active' | 'completed'>('all')` 管理
- 前端过滤：`todos.filter(t => ...)` 不发起新请求
- 当前选中 Tab 高亮（shadcn 样式或 Tailwind `data-active` 变体）

### 模块 5: TodoItem 组件

- `Checkbox`（来自 packages/ui）切换完成状态，`toggleMutation.mutate`
- 已完成任务标题加 `line-through text-muted-foreground`
- 展示 `createdAt`（格式化为本地时间）
- 删除按钮点击后设置 `pendingDeleteId` state，触发底部确认弹层

### 模块 6: 删除确认弹层

- 用 `sonner` 的 `toast.custom` 或简单的固定底部 div（`fixed bottom-0`）实现
- 展示「确认删除这条任务吗？」+ 取消/删除按钮
- 确认后调用 `deleteMutation.mutate({ id: pendingDeleteId })`

### 模块 7: 加载 / 空 / 错误状态

- 加载中：`todosQuery.isPending` → 展示 `Skeleton` 组件（packages/ui）
- 错误：`todosQuery.isError` → 展示错误提示 + 「重新加载」按钮（`todosQuery.refetch()`）
- 空状态：过滤后数组为空 → 根据当前筛选项展示不同文案

## 接口契约

依赖 1.todo-db-api 定义的 tRPC types，通过 `@my-todo-list/api/routers/index` 的 `AppRouter` 类型自动推断，无需手写。

## 安全考虑

- 无鉴权（`publicProcedure`），无需处理 401
- 输入框在 TanStack Form + Zod 层做 trim 和长度校验，防止空提交

## 技术决策

| 决策 | 选择 | 理由 |
| ---- | ---- | ---- |
| 筛选实现 | 前端过滤 | PRD 明确筛选在前端完成，不增加接口复杂度 |
| 删除确认 | 固定底部弹层 | 移动端友好，实现简单，PRD 明确要求轻量二次确认 |
| 状态更新 | invalidateQueries | 保持数据一致性，实现简单 |
| 页面位置 | index.tsx（首页） | PRD 是单页应用，直接复用根路由 |

---
description: Git 提交、分支与 PR 规范
---

# Git Workflow

## Pre-commit Hook

`.husky/pre-commit` 自动执行：

1. `pnpm test` — 运行测试（当前项目无测试框架，此步实际跳过）
2. `pnpm dlx ultracite fix` — 格式化所有 staged 文件
3. 重新 `git add` 已格式化的文件

提交时无需手动跑 `pnpm fix`，hook 会自动处理。如果 `ultracite fix` 发现无法自动修复的问题，commit 会被阻断，需手动修复后重新提交。

## Commit 规范

使用 Conventional Commits 格式：

```
<type>: <描述>

type: feat | fix | chore | docs | refactor | test | style | perf
```

示例：
- `feat: add createTodo tRPC mutation`
- `fix: correct session check in protectedProcedure`
- `chore: update drizzle-kit to v0.31`

## 分支命名

项目未配置强制 branch 规则，推荐约定：

- 功能：`feat/<简短描述>`
- 修复：`fix/<简短描述>`
- 维护：`chore/<简短描述>`

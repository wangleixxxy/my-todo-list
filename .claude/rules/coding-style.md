---
description: 代码风格与格式规范，基于 Biome + Ultracite 配置推断
---

# Coding Style

## 格式

- 缩进：**Tab**（不用空格）
- 引号：**双引号**（JavaScript/TypeScript）
- Import 排序：Biome assist 自动处理，保存时自动整理
- Tailwind 类名排序：`clsx`、`cva`、`cn` 函数内的类名由 Biome `useSortedClasses` 自动排序

## TypeScript

- 启用 `strict` 模式 + `noUncheckedIndexedAccess` + `noUnusedLocals` + `noUnusedParameters`
- 禁止推断类型时写多余的类型注解（`noInferrableTypes`）
- 使用 `as const` 断言代替字面量类型（`useAsConstAssertion`）
- 默认参数必须放在末尾（`useDefaultParameterLast`）
- enum 成员必须显式初始化（`useEnumInitializers`）
- 禁止无用的 else（`noUselessElse`），改用 early return

## 代码规范

- 禁止给参数重新赋值（`noParameterAssign`），需要可变值时用局部变量
- JSX 自闭合标签（`useSelfClosingElements`）：无子节点时用 `<Comp />`
- 禁止模板字面量里的无用表达式（`noUnusedTemplateLiteral`）
- 使用 `Number.isNaN` 等命名空间写法代替全局（`useNumberNamespace`）
- 一个 `var/let/const` 声明只声明一个变量（`useSingleVarDeclarator`）

## 执行方式

- 检查：`pnpm check`
- 修复：`pnpm fix`
- pre-commit hook 自动运行 `ultracite fix` 并重新 stage 已格式化的文件

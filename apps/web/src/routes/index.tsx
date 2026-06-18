import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	CircleUser,
	CloudOff,
	Inbox,
	ListChecks,
	Loader,
	Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { z } from "zod";

import { queryClient, trpc } from "@/utils/trpc";

export const Route = createFileRoute("/")({
	component: TodoPage,
});

// Design tokens from Stitch export
const C = {
	primary: "#0058be",
	onPrimary: "#ffffff",
	surface: "#f7f9fd",
	surfaceContainerLow: "#f2f4f8",
	surfaceContainerHigh: "#e6e8ec",
	outlineVariant: "#c2c6d6",
	outline: "#727785",
	onSurface: "#191c1f",
	onSurfaceVariant: "#424754",
	secondary: "#5c5f60",
	secondaryFixed: "#e1e2e4",
	onSecondaryFixed: "#191c1e",
	error: "#ba1a1a",
	onError: "#ffffff",
	errorContainer: "#ffdad6",
	onErrorContainer: "#93000a",
} as const;

type FilterType = "all" | "active" | "completed";
interface Todo {
	completed: boolean;
	id: string;
	title: string;
}

const titleSchema = z.string().min(1).max(50).trim();

const filterLabels: Record<FilterType, string> = {
	all: "全部",
	active: "未完成",
	completed: "已完成",
};

const getEmptyDescription = (filter: FilterType) => {
	if (filter === "active") {
		return "没有未完成的任务";
	}
	if (filter === "completed") {
		return "没有已完成的任务";
	}
	return "点击上方添加按钮开启高效的一天";
};

const getTodoBackground = (completed: boolean) => {
	if (completed) {
		return C.surfaceContainerLow;
	}
	return "#ffffff";
};

const getCheckboxStyle = (completed: boolean) => {
	if (completed) {
		return { backgroundColor: C.primary, borderColor: C.primary };
	}
	return {
		backgroundColor: "transparent",
		borderColor: C.outline,
	};
};

function LoadingState() {
	return (
		<div
			className="flex flex-col items-center justify-center rounded-2xl border p-8"
			style={{
				backgroundColor: C.surface,
				borderColor: C.outlineVariant,
			}}
		>
			<Loader
				className="mb-4 animate-spin"
				color={C.primary}
				size={32}
				strokeDasharray="4 2"
			/>
			<span className="font-bold text-sm" style={{ color: C.primary }}>
				正在加载中...
			</span>
		</div>
	);
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
	return (
		<div
			className="flex flex-col items-center justify-center rounded-2xl border p-8"
			style={{
				backgroundColor: C.errorContainer,
				borderColor: `${C.error}33`,
			}}
		>
			<CloudOff className="mb-2" color={C.error} size={40} />
			<span className="mb-1 font-bold text-sm" style={{ color: C.error }}>
				加载失败
			</span>
			<p
				className="mb-4 text-center text-xs"
				style={{ color: C.onErrorContainer, opacity: 0.7 }}
			>
				网络连接不稳定，请稍后重试
			</p>
			<button
				className="rounded-full px-6 py-2 font-bold text-xs transition-transform active:scale-95"
				onClick={onRetry}
				style={{ backgroundColor: C.primary, color: C.onPrimary }}
				type="button"
			>
				重新加载
			</button>
		</div>
	);
}

function EmptyState({ description }: { description: string }) {
	return (
		<div
			className="flex flex-col items-center justify-center rounded-2xl border p-8"
			style={{
				backgroundColor: C.surface,
				borderColor: C.outlineVariant,
			}}
		>
			<div
				className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl border"
				style={{
					backgroundColor: C.surfaceContainerHigh,
					borderColor: C.outlineVariant,
				}}
			>
				<Inbox color={C.outline} size={40} />
			</div>
			<span className="text-base" style={{ color: C.secondary }}>
				暂无待办事项
			</span>
			<p className="mt-1 text-center text-xs" style={{ color: C.outline }}>
				{description}
			</p>
		</div>
	);
}

function TodoList({
	isToggling,
	onRequestDelete,
	onToggle,
	todos,
}: {
	isToggling: boolean;
	onRequestDelete: (id: string) => void;
	onToggle: (todo: Todo) => void;
	todos: Todo[];
}) {
	return (
		<ul className="space-y-2">
			{todos.map((todo) => (
				<TodoItem
					isToggling={isToggling}
					key={todo.id}
					onRequestDelete={onRequestDelete}
					onToggle={onToggle}
					todo={todo}
				/>
			))}
		</ul>
	);
}

function TodoItem({
	isToggling,
	onRequestDelete,
	onToggle,
	todo,
}: {
	isToggling: boolean;
	onRequestDelete: (id: string) => void;
	onToggle: (todo: Todo) => void;
	todo: Todo;
}) {
	return (
		<li
			className="flex items-center justify-between rounded-xl border p-4 transition-colors"
			style={{
				backgroundColor: getTodoBackground(todo.completed),
				borderColor: C.outlineVariant,
				opacity: todo.completed ? 0.6 : 1,
			}}
		>
			<button
				className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors"
				disabled={isToggling}
				onClick={() => onToggle(todo)}
				style={getCheckboxStyle(todo.completed)}
				type="button"
			>
				{todo.completed && (
					<Check color={C.onPrimary} size={14} strokeWidth={3} />
				)}
			</button>

			<span
				className="mx-4 flex-1 text-sm"
				style={{
					color: todo.completed ? C.secondary : C.onSurface,
					textDecoration: todo.completed ? "line-through" : "none",
				}}
			>
				{todo.title}
			</span>

			<button
				className="shrink-0 transition-opacity hover:opacity-70"
				onClick={() => onRequestDelete(todo.id)}
				type="button"
			>
				<Trash2 color={C.secondary} size={20} />
			</button>
		</li>
	);
}

function TodoPage() {
	const [filter, setFilter] = useState<FilterType>("all");
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

	const todosQuery = useQuery(trpc.todo.getAll.queryOptions());

	const createMutation = useMutation(
		trpc.todo.create.mutationOptions({
			onSuccess: () =>
				queryClient.invalidateQueries(trpc.todo.getAll.queryOptions()),
		})
	);

	const toggleMutation = useMutation(
		trpc.todo.toggle.mutationOptions({
			onSuccess: () =>
				queryClient.invalidateQueries(trpc.todo.getAll.queryOptions()),
		})
	);

	const deleteMutation = useMutation(
		trpc.todo.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(trpc.todo.getAll.queryOptions());
				setPendingDeleteId(null);
			},
		})
	);

	const todos = todosQuery.data ?? [];
	const activeCount = todos.filter((t) => !t.completed).length;

	const filteredTodos = todos.filter((t) => {
		if (filter === "active") {
			return !t.completed;
		}
		if (filter === "completed") {
			return t.completed;
		}
		return true;
	});
	const emptyDescription = getEmptyDescription(filter);

	const form = useForm({
		defaultValues: { title: "" },
		onSubmit: async ({ value, formApi }) => {
			const result = titleSchema.safeParse(value.title);
			if (!result.success) {
				return;
			}
			await createMutation.mutateAsync({ title: result.data });
			formApi.reset();
		},
	});

	let listContent: React.ReactNode;
	if (todosQuery.isPending) {
		listContent = <LoadingState />;
	} else if (todosQuery.isError) {
		listContent = <ErrorState onRetry={() => todosQuery.refetch()} />;
	} else if (filteredTodos.length === 0) {
		listContent = <EmptyState description={emptyDescription} />;
	} else {
		listContent = (
			<TodoList
				isToggling={toggleMutation.isPending}
				onRequestDelete={setPendingDeleteId}
				onToggle={(todo) =>
					toggleMutation.mutate({
						id: todo.id,
						completed: !todo.completed,
					})
				}
				todos={filteredTodos}
			/>
		);
	}

	return (
		<div
			className="min-h-screen"
			style={{
				backgroundColor: C.surface,
				fontFamily: "'Inter', 'PingFang SC', sans-serif",
			}}
		>
			{/* ── TopAppBar ── */}
			<div
				className="sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4"
				style={{ backgroundColor: C.surface, borderColor: C.outlineVariant }}
			>
				<div className="flex items-center gap-2">
					<ListChecks color={C.primary} size={22} />
					<span className="font-bold text-lg" style={{ color: C.onSurface }}>
						我的待办
					</span>
				</div>
				<CircleUser color={C.onSurfaceVariant} size={24} />
			</div>

			{/* ── Content ── */}
			<div className="space-y-5 px-4 pt-4 pb-8">
				{/* Subtitle */}
				<p className="font-medium text-xs" style={{ color: C.secondary }}>
					当前有 {activeCount} 个未完成
				</p>

				{/* ── Input ── */}
				<form
					className="flex gap-2"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<form.Field name="title">
						{(field) => (
							<input
								className="h-12 flex-1 rounded-lg border bg-white px-4 text-sm transition-colors focus:outline-none"
								onBlur={(e) => {
									e.currentTarget.style.borderColor = C.outlineVariant;
								}}
								onChange={(e) => field.handleChange(e.target.value)}
								onFocus={(e) => {
									e.currentTarget.style.borderColor = C.primary;
								}}
								placeholder="请输入待办事项"
								style={{ borderColor: C.outlineVariant, color: C.onSurface }}
								value={field.state.value}
							/>
						)}
					</form.Field>
					<button
						className="h-12 rounded-lg px-6 font-bold text-sm transition-transform active:scale-95 disabled:opacity-60"
						disabled={createMutation.isPending}
						style={{ backgroundColor: C.primary, color: C.onPrimary }}
						type="submit"
					>
						添加
					</button>
				</form>

				{/* ── Filter tabs (underline style) ── */}
				<div
					className="flex border-b"
					style={{ borderColor: C.outlineVariant }}
				>
					{(["all", "active", "completed"] as const).map((f) => (
						<button
							className="flex-1 py-2 text-xs transition-colors"
							key={f}
							onClick={() => setFilter(f)}
							style={
								filter === f
									? {
											color: C.primary,
											fontWeight: 700,
											borderBottom: `2px solid ${C.primary}`,
											marginBottom: "-1px",
										}
									: { color: C.secondary, fontWeight: 400 }
							}
							type="button"
						>
							{filterLabels[f]}
						</button>
					))}
				</div>

				{/* ── List area ── */}
				{listContent}
			</div>

			{/* ── Delete confirmation ── */}
			{pendingDeleteId !== null && (
				<>
					<button
						aria-label="关闭删除确认"
						className="fixed inset-0 z-50 backdrop-blur-[2px]"
						onClick={() => setPendingDeleteId(null)}
						style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
						type="button"
					/>
					{/* Bottom sheet */}
					<div
						className="fixed right-0 bottom-0 left-0 z-[60] p-6 shadow-2xl"
						style={{
							backgroundColor: C.surface,
							borderRadius: "32px 32px 0 0",
						}}
					>
						{/* Handle bar */}
						<div
							className="mx-auto mb-6 h-1 w-10 rounded-full"
							style={{ backgroundColor: C.outlineVariant }}
						/>
						<div className="space-y-4">
							<div className="space-y-2">
								<h4
									className="font-semibold text-lg"
									style={{ color: C.onSurface }}
								>
									确认删除这条任务？
								</h4>
								<p className="text-sm" style={{ color: C.onSurfaceVariant }}>
									删除后该任务会从列表中移除。接口失败时保留原任务并提示失败。
								</p>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									className="flex-1 rounded-2xl py-4 font-bold transition-colors active:scale-95"
									onClick={() => setPendingDeleteId(null)}
									style={{
										backgroundColor: C.secondaryFixed,
										color: C.onSecondaryFixed,
									}}
									type="button"
								>
									取消
								</button>
								<button
									className="flex-1 rounded-2xl py-4 font-bold transition-transform active:scale-95 disabled:opacity-60"
									disabled={deleteMutation.isPending}
									onClick={() => deleteMutation.mutate({ id: pendingDeleteId })}
									style={{ backgroundColor: C.error, color: C.onError }}
									type="button"
								>
									删除
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

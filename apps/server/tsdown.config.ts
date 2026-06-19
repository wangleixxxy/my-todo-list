import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "./src/index.ts",
		lambda: "./src/lambda.ts",
		worker: "./src/worker.ts",
	},
	format: "esm",
	outDir: "./dist",
	clean: true,
	noExternal: [/@my-todo-list\/.*/],
});

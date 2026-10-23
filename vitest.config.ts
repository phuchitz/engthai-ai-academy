import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    maxWorkers: 2,
    testTimeout: 15000,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/test/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/assessment.ts",
        "src/lib/learning.ts",
        "src/lib/storage.ts",
        "src/lib/security.ts",
      ],
      reporter: ["text", "html", "lcov"],
    },
  },
});

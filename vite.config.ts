import { defineConfig } from "vite";

import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    fileParallelism: false,
    workspace: [
      {
        extends: true,
        test: {
          name: "domain",
          include: ["./src/domain/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "application",
          include: ["./src/application/**/*.test.ts"],
        },
      },

      {
        extends: true,
        test: {
          name: "infrastructure",
          include: ["./src/presentation/routes/**/*.test.ts"],
          globalSetup: ["./src/testSetup/globalSetup.ts"],
          setupFiles: "./src/testSetup/localSetup.ts",
        },
      },
    ],
    testTimeout: 10000000,
    environment: "node",
    hookTimeout: 10000000,
    coverage: {
      provider: "v8", // or 'v8'
    },
  },
});

import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rstest/core';

// Docs: https://rstest.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  reporters: 'verbose',
  coverage: {
    enabled: true,
    provider: 'istanbul',
    clean: true,
  },
  testEnvironment: 'jsdom',
  setupFiles: ['./rstest.setup.js'],
});

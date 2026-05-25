import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: [
    {
      command: 'node ../backend/server.js',
      port: 3001,
      cwd: '../backend',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npx vite --host',
      port: 5173,
      cwd: '.',
      reuseExistingServer: !process.env.CI,
    },
  ],
})

import { defineConfig, devices } from "@playwright/test";

// Local extracted libs needed by Chrome (avoids system-wide installation)
const PW_LIBS = "/tmp/pw-libs/usr/lib/x86_64-linux-gnu";
process.env.LD_LIBRARY_PATH = PW_LIBS + (process.env.LD_LIBRARY_PATH ? `:${process.env.LD_LIBRARY_PATH}` : "");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: "/home/alex/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
          env: { LD_LIBRARY_PATH: PW_LIBS },
        },
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

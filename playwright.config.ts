import { defineConfig, devices } from '@playwright/test'

/* =============================================================
 * Playwright E2E — Mission-Critical 플로우 (CLAUDE.md §6)
 *   설치(최초 1회):  pnpm add -D @playwright/test && pnpm test:e2e:install
 *   실행:            pnpm test:e2e   (webServer 가 pnpm dev 를 자동 기동)
 *
 *   무료 진단 리포트는 클라이언트(analyzeFree)에서 계산되므로 DB 없이
 *   `pnpm dev` 만으로 E2E 가 통과한다. 서버 영속화(/api/diagnoses)는
 *   src/test/diagnosesApi.test.ts(mocked prisma)가 별도로 검증한다.
 * ============================================================= */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 분석 로딩이 의도적으로 12초 고정(AnalysisLoading DURATION) + dev 콜드 컴파일 여유.
  timeout: 90_000,
  // 로컬은 list, CI는 list + html(아티팩트 업로드용 playwright-report/).
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

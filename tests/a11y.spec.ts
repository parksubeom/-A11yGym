import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * 접근성 자동 테스트 (axe-core)
 *
 * 실행 방법:
 * - 먼저 Next dev 서버를 실행한 뒤:
 *   npm run dev
 * - 다른 터미널에서:
 *   npm run test:a11y
 *
 * 참고:
 * - 라우트가 늘어나면 아래 테스트 케이스를 추가하세요.
 */

test.describe('A11y (axe-core)', () => {
  test('홈 페이지는 치명적 위반이 없어야 한다', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      // 필요 시 가이드라인 커스터마이즈:
      // .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    // 위반 사항이 있으면 리포트를 보기 좋게 출력
    if (results.violations.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          nodes: v.nodes.length,
        }))
      )
    }

    expect(results.violations).toEqual([])
  })

  test('챌린지 페이지는 치명적 위반이 없어야 한다', async ({ page }) => {
    // 로컬 샘플 챌린지 라우트가 존재한다고 가정 (SAMPLE_CHALLENGES id 사용)
    await page.goto('/challenges/missing-alt-1-1-1')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})



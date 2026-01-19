/**
 * @deprecated 이 파일은 JSX(TSX)를 포함하므로 `.ts`에 두면 Next/SWC가 파싱에 실패할 수 있습니다.
 * `app/providers.tsx`의 Providers(QueryClientProvider 래핑)를 사용하세요.
 *
 * - 원인: `.ts` 파일에서 JSX를 사용하면 `Expected '>', got 'client'` 같은 SWC 파싱 에러가 발생합니다.
 * - 해결: JSX를 포함하는 컴포넌트는 `.tsx`로 두거나(파일명 변경), 여기처럼 re-export로 전환합니다.
 */

export { Providers as QueryProvider } from '@/app/providers'


# A11y Training Platform

접근성 근육을 키우는 gym을 뜻하는 웹 접근성 연습 플랫폼

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Backend**: Supabase
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Code Editor**: Monaco Editor

## 프로젝트 구조

```
├── app/              # Next.js App Router 페이지 라우팅
├── components/       # 재사용 가능한 UI 컴포넌트
│   └── ui/          # shadcn/ui 컴포넌트
├── lib/             # Supabase 클라이언트 등 유틸리티 함수
├── types/           # TypeScript 타입 정의
├── hooks/           # 커스텀 훅 (React Query 등)
├── store/           # Zustand 상태 관리 스토어
└── constants/       # KWCAG 지침 및 상수 데이터
```

## 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행
- `npm run seed` - Supabase 데이터 시딩

## 절대 경로 설정

프로젝트는 `@/*` 절대 경로를 사용합니다. 예:

```typescript
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/store'
import { KWCAG_LEVELS } from '@/constants/kwcag'
```

## shadcn/ui 사용

컴포넌트를 추가하려면:

```bash
npx shadcn@latest add [component-name]
```

## 배포

### Vercel 배포

이 프로젝트는 Vercel에 배포할 수 있습니다.

#### 빠른 배포

1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. **"Add New Project"** 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **"Deploy"** 클릭

자세한 배포 가이드는 [Vercel 배포 가이드](docs/24-vercel-deployment-guide.md)를 참고하세요.

## 접근성 기능

이 프로젝트는 웹 접근성 학습을 위한 플랫폼입니다.

### 주요 기능

- **실시간 접근성 검사**: PreviewPanel에서 `axe-core`를 사용한 실시간 접근성 이슈 탐지
- **챌린지 기반 학습**: 실제 웹 개발에서 자주 발생하는 접근성 문제를 다루는 실전 챌린지
- **ESLint 통합**: 개발 단계 접근성 검증 (`eslint-plugin-jsx-a11y`)

### 관련 문서

- [axe-core 검사 규칙](docs/17-axe-core-detection-rules.md)
- [색 대비 검사 원리](docs/16-color-contrast-detection-principle.md)

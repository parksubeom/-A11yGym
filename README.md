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

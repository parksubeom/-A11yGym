# 01. 프로젝트 초기화 (Project Initialization)

## 작업 개요

Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui를 기반으로 한 'a11y-training-platform' 프로젝트를 생성합니다.

## 요구사항 분석

### 기술 스택 요구사항
- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack React Query
- **백엔드**: Supabase
- **아이콘**: Lucide React
- **폼 관리**: React Hook Form + Zod
- **코드 에디터**: Monaco Editor

### 프로젝트 구조 요구사항
```
/app          - Next.js 14 App Router 페이지 라우팅
/components   - 재사용 가능한 UI 컴포넌트
/lib          - Supabase 클라이언트 등 유틸리티 함수
/types        - TypeScript 타입 정의
/hooks        - 커스텀 훅 (React Query 등)
/store        - Zustand 상태 관리 스토어
/constants    - KWCAG 지침 및 상수 데이터
```

### 설정 요구사항
- `package.json`에 개발/빌드/시작/린트 스크립트 포함
- `tsconfig.json`에 절대 경로(`@/*`) 설정

## 추론 과정

### 1. 프로젝트 생성 방법 선택

**문제**: `npx create-next-app@latest` 명령어를 사용하려 했으나 디렉토리 이름에 대문자가 포함되어 npm 네이밍 제약으로 실패했습니다.

**해결책**: 수동으로 프로젝트 파일들을 생성하는 방식을 선택했습니다. 이는 더 세밀한 제어가 가능하고, 요구사항에 맞는 정확한 설정을 할 수 있습니다.

### 2. 패키지 버전 선택

**추론**:
- Next.js 14.2.5: 안정적인 14 버전 사용
- React 18.3.1: Next.js 14와 호환되는 최신 안정 버전
- TypeScript 5.5.4: 최신 안정 버전
- TanStack React Query 5.56.2: 최신 v5 버전 (서버 컴포넌트 지원)
- Zustand 4.5.5: 최신 안정 버전
- Monaco Editor 0.46.0: 코드 에디터 구현용

**주의사항**: `@types/monaco-editor`는 존재하지 않으므로 제외했습니다. Monaco Editor는 자체 타입 정의를 포함하고 있습니다.

### 3. 프로젝트 구조 설계

**디렉토리 구조 결정 이유**:
- `/app`: Next.js 14 App Router의 기본 디렉토리
- `/components`: 재사용 가능한 컴포넌트 분리
- `/lib`: 유틸리티 함수와 외부 라이브러리 클라이언트 (Supabase 등)
- `/types`: TypeScript 타입 정의 중앙화
- `/hooks`: 커스텀 훅 분리 (관심사 분리)
- `/store`: Zustand 스토어 중앙화
- `/constants`: 상수 데이터 분리 (KWCAG 지침 등)

## 구현 방법

### 1. package.json 생성

**파일 경로**: `package.json`

**구현 내용**:
```json
{
  "name": "a11y-training-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    // 핵심 프레임워크
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "14.2.5",
    
    // 상태 관리 및 데이터 페칭
    "@tanstack/react-query": "^5.56.2",
    "zustand": "^4.5.5",
    
    // 백엔드 연동
    "@supabase/supabase-js": "^2.45.4",
    
    // UI 및 스타일링
    "lucide-react": "^0.427.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    
    // 폼 관리
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.8",
    "@hookform/resolvers": "^3.9.0",
    
    // 코드 에디터
    "monaco-editor": "^0.46.0"
  },
  "devDependencies": {
    // TypeScript
    "typescript": "^5.5.4",
    "@types/node": "^22.5.4",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    
    // 스타일링
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.9",
    "tailwindcss-animate": "^1.0.7",
    
    // 린팅
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5"
  }
}
```

**이유**:
- `scripts`: Next.js 표준 스크립트 포함
- `dependencies`: 런타임에 필요한 모든 패키지
- `devDependencies`: 개발 시에만 필요한 패키지 분리

### 2. tsconfig.json 생성

**파일 경로**: `tsconfig.json`

**구현 내용**:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**핵심 설정 설명**:
- `"paths": { "@/*": ["./*"] }`: 절대 경로 설정으로 `@/components`, `@/lib` 등으로 import 가능
- `"moduleResolution": "bundler"`: Next.js의 번들러와 호환
- `"jsx": "preserve"`: Next.js가 JSX를 처리하도록 설정
- `"strict": true`: TypeScript 엄격 모드 활성화

**이유**: 
- 절대 경로 사용으로 import 경로가 깔끔해지고 유지보수가 쉬워짐
- Next.js 14의 권장 설정을 따름

### 3. Tailwind CSS 설정

**파일 경로**: `tailwind.config.ts`

**구현 내용**:
- shadcn/ui 호환 설정 포함
- CSS 변수를 사용한 테마 시스템
- 다크 모드 지원
- 컨테이너, 색상, 애니메이션 등 확장 설정

**이유**: 
- shadcn/ui는 CSS 변수 기반 테마 시스템을 사용
- 다크 모드 지원을 위한 설정 필요
- `tailwindcss-animate` 플러그인으로 애니메이션 유틸리티 제공

**파일 경로**: `postcss.config.js`

**구현 내용**:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**이유**: Tailwind CSS와 Autoprefixer를 PostCSS로 처리

**파일 경로**: `app/globals.css`

**구현 내용**:
- Tailwind 기본 스타일 import
- CSS 변수 정의 (라이트/다크 모드)
- shadcn/ui 테마 변수 정의

**이유**: 
- 전역 스타일 설정
- CSS 변수를 통한 테마 시스템 구현

### 4. Next.js 설정

**파일 경로**: `next.config.js`

**구현 내용**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

**이유**: 
- React Strict Mode 활성화로 개발 시 잠재적 문제 사전 발견
- 기본 설정으로 시작, 필요시 확장 가능

### 5. App Router 구조 생성

**파일 경로**: `app/layout.tsx`

**구현 내용**:
- Root Layout 컴포넌트
- 메타데이터 설정
- Providers 래퍼 (React Query 포함)
- Inter 폰트 적용

**이유**: 
- Next.js 14 App Router의 루트 레이아웃
- 전역 설정 및 Provider 적용 위치

**파일 경로**: `app/page.tsx`

**구현 내용**:
- 기본 홈 페이지 컴포넌트
- 프로젝트 소개 텍스트

**이유**: Next.js App Router의 기본 페이지

**파일 경로**: `app/providers.tsx`

**구현 내용**:
```typescript
'use client'

import { QueryProvider } from '@/hooks/use-query'

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}
```

**이유**: 
- Client Component로 분리 (React Query는 클라이언트에서만 동작)
- Server Component인 layout.tsx에서 사용 가능하도록 분리

### 6. React Query 설정

**파일 경로**: `hooks/use-query.ts`

**구현 내용**:
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**이유**:
- `useState`의 lazy initialization 사용으로 QueryClient 인스턴스가 한 번만 생성되도록 보장
- `staleTime` 설정으로 불필요한 리페칭 방지
- Client Component로 분리

### 7. Supabase 클라이언트 설정

**파일 경로**: `lib/supabase.ts`

**구현 내용**:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**이유**:
- 환경 변수에서 Supabase 설정 읽기
- 싱글톤 패턴으로 클라이언트 인스턴스 재사용
- `NEXT_PUBLIC_` 접두사로 클라이언트에서 접근 가능하도록 설정

### 8. 유틸리티 함수

**파일 경로**: `lib/utils.ts`

**구현 내용**:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**이유**:
- shadcn/ui의 표준 유틸리티 함수
- `clsx`로 조건부 클래스 결합, `tailwind-merge`로 Tailwind 클래스 충돌 해결

### 9. Zustand 스토어 설정

**파일 경로**: `store/index.ts`

**구현 내용**:
```typescript
import { create } from 'zustand'

interface AppState {
  // 상태 타입 정의
}

export const useAppStore = create<AppState>()((set) => ({
  // 초기 상태 및 액션들
}))
```

**이유**:
- 기본 스토어 구조 제공
- 필요시 확장 가능한 구조

### 10. 타입 정의

**파일 경로**: `types/index.ts`

**구현 내용**:
```typescript
export interface User {
  id: string
  email?: string
  name?: string
}
```

**이유**:
- 공통 타입 정의 중앙화
- 기본 타입 예시 제공

### 11. 상수 데이터

**파일 경로**: `constants/kwcag.ts`

**구현 내용**:
```typescript
export const KWCAG_LEVELS = {
  A: 'A',
  AA: 'AA',
  AAA: 'AAA',
} as const

export type KWCAGLevel = typeof KWCAG_LEVELS[keyof typeof KWCAG_LEVELS]
```

**이유**:
- KWCAG 레벨 상수 정의
- 타입 안전성 보장 (`as const` 사용)

### 12. shadcn/ui 설정

**파일 경로**: `components.json`

**구현 내용**:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**이유**:
- shadcn/ui CLI가 사용하는 설정 파일
- 절대 경로 alias 설정
- RSC(React Server Components) 지원 활성화

### 13. ESLint 설정

**파일 경로**: `.eslintrc.json`

**구현 내용**:
```json
{
  "extends": "next/core-web-vitals"
}
```

**이유**: Next.js 권장 ESLint 설정 사용

### 14. .gitignore 설정

**파일 경로**: `.gitignore`

**구현 내용**: Next.js 표준 .gitignore 패턴

**이유**: 불필요한 파일들을 버전 관리에서 제외

## 실행 순서

이 문서만으로 같은 결과물을 만들기 위한 단계별 실행 순서:

1. **프로젝트 디렉토리 생성** (이미 존재하는 경우 스킵)
   ```bash
   mkdir a11y-training-platform
   cd a11y-training-platform
   ```

2. **모든 설정 파일 생성**
   - `package.json` 생성
   - `tsconfig.json` 생성
   - `next.config.js` 생성
   - `tailwind.config.ts` 생성
   - `postcss.config.js` 생성
   - `.eslintrc.json` 생성
   - `.gitignore` 생성
   - `components.json` 생성

3. **디렉토리 구조 생성**
   ```bash
   mkdir -p app components/ui lib types hooks store constants
   ```

4. **소스 파일 생성**
   - `app/layout.tsx`
   - `app/page.tsx`
   - `app/providers.tsx`
   - `app/globals.css`
   - `lib/utils.ts`
   - `lib/supabase.ts`
   - `hooks/use-query.ts`
   - `store/index.ts`
   - `types/index.ts`
   - `constants/kwcag.ts`

5. **패키지 설치**
   ```bash
   npm install
   ```

6. **환경 변수 설정** (선택사항)
   `.env.local` 파일 생성:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

7. **개발 서버 실행**
   ```bash
   npm run dev
   ```

## 검증 방법

프로젝트가 올바르게 설정되었는지 확인:

1. **타입 체크**
   ```bash
   npx tsc --noEmit
   ```

2. **린트 체크**
   ```bash
   npm run lint
   ```

3. **빌드 테스트**
   ```bash
   npm run build
   ```

4. **개발 서버 실행 확인**
   ```bash
   npm run dev
   ```
   브라우저에서 http://localhost:3000 접속하여 페이지가 정상적으로 표시되는지 확인

## 주의사항

1. **Monaco Editor 타입**: `@types/monaco-editor` 패키지는 존재하지 않습니다. Monaco Editor는 자체 타입 정의를 포함하고 있습니다.

2. **환경 변수**: Supabase를 사용하려면 `.env.local` 파일에 환경 변수를 설정해야 합니다.

3. **shadcn/ui 컴포넌트**: 기본 설정만 완료되었습니다. 실제 컴포넌트는 다음 명령어로 추가할 수 있습니다:
   ```bash
   npx shadcn@latest add button
   ```

4. **Next.js 버전**: 보안 업데이트가 있을 수 있으므로 필요시 업데이트를 고려하세요.

## 다음 단계

프로젝트 초기화가 완료되었으므로, 다음 작업을 진행할 수 있습니다:

1. shadcn/ui 컴포넌트 추가
2. 페이지 라우팅 구현
3. Supabase 연동 및 인증 구현
4. 상태 관리 로직 구현
5. KWCAG 지침 기반 컴포넌트 개발

## 참고 자료

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [Supabase Documentation](https://supabase.com/docs)


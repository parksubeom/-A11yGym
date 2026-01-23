# 15. 디자인 테마 및 반응형 레이아웃 수정 가이드

## 개요

이 문서는 A11yGym 플랫폼의 디자인 테마, 색상, 반응형 레이아웃을 수정하기 위해 어떤 파일들을 중심으로 작업해야 하는지 정리한 가이드입니다.

## 디자인 시스템 구조

이 프로젝트는 **shadcn/ui** 기반의 디자인 시스템을 사용하며, **Tailwind CSS**로 스타일링됩니다.

### 핵심 원칙

- **CSS 변수 기반 테마**: HSL 색상 값을 CSS 변수로 관리
- **다크 모드 지원**: `.dark` 클래스를 통한 다크 모드 전환
- **반응형 우선**: 모바일 퍼스트 접근 방식
- **컴포넌트 기반**: 재사용 가능한 UI 컴포넌트

---

## 1. 테마 색상 수정

### 1.1 주요 파일

#### `app/globals.css`
**역할**: 전체 테마 색상 변수 정의

**수정 위치**:
```css
@layer base {
  :root {
    /* 라이트 모드 색상 */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --secondary: 210 40% 96.1%;
    /* ... 기타 색상 변수 */
  }

  .dark {
    /* 다크 모드 색상 */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... 기타 색상 변수 */
  }
}
```

**색상 변수 목록**:
- `--background`: 배경색
- `--foreground`: 텍스트 색상
- `--primary`: 주요 색상 (버튼, 링크 등)
- `--primary-foreground`: 주요 색상 위 텍스트
- `--secondary`: 보조 색상
- `--muted`: 음소거된 색상 (비활성 요소)
- `--accent`: 강조 색상
- `--destructive`: 경고/삭제 색상
- `--border`: 테두리 색상
- `--input`: 입력 필드 색상
- `--ring`: 포커스 링 색상
- `--card`: 카드 배경색
- `--popover`: 팝오버 배경색

**수정 방법**:
1. HSL 색상 값을 변경 (예: `222.2 84% 4.9%` → `220 90% 10%`)
2. 온라인 HSL 컨버터 사용 권장: https://hslpicker.com/

#### `tailwind.config.ts`
**역할**: Tailwind CSS 설정 및 색상 매핑

**수정 위치**:
```typescript
theme: {
  extend: {
    colors: {
      // CSS 변수를 Tailwind 클래스로 매핑
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      // ... 기타 색상
    }
  }
}
```

**주의사항**:
- 색상 값은 `globals.css`의 CSS 변수를 참조하므로, 직접 색상 값을 넣지 않음
- 새로운 색상을 추가하려면 `globals.css`에 변수를 추가한 후 여기서 매핑

---

## 2. 반응형 레이아웃 수정

### 2.1 Tailwind 브레이크포인트

**기본 브레이크포인트** (Tailwind 기본값):
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**커스텀 브레이크포인트 추가** (`tailwind.config.ts`):
```typescript
theme: {
  extend: {
    screens: {
      'xs': '475px',  // 추가 브레이크포인트
      '3xl': '1920px',
    }
  }
}
```

### 2.2 컨테이너 설정

**파일**: `tailwind.config.ts`

**수정 위치**:
```typescript
container: {
  center: true,        // 중앙 정렬
  padding: '2rem',     // 패딩
  screens: {
    '2xl': '1400px'    // 최대 너비
  }
}
```

### 2.3 주요 레이아웃 파일

#### `app/layout.tsx`
**역할**: 전체 앱의 루트 레이아웃

**수정 사항**:
- 전체 페이지 구조
- 메타데이터
- 폰트 설정
- 전역 스타일 적용

#### `app/page.tsx`
**역할**: 메인 페이지 레이아웃

**수정 사항**:
- 홈페이지 레이아웃
- 챌린지 목록 그리드
- 반응형 그리드 설정

**예시**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 반응형 그리드 */}
</div>
```

#### `app/challenges/[id]/page.tsx`
**역할**: 챌린지 상세 페이지 레이아웃

**수정 사항**:
- 코드 에디터와 미리보기 패널 레이아웃
- Resizable 패널 설정
- 모바일/데스크톱 레이아웃 전환

**주요 레이아웃 컴포넌트**:
- `Resizable` (shadcn/ui): 패널 크기 조절
- 반응형 스택/그리드 레이아웃

---

## 3. UI 컴포넌트 수정

### 3.1 shadcn/ui 컴포넌트

**위치**: `components/ui/`

**주요 컴포넌트**:
- `button.tsx`: 버튼 스타일
- `card.tsx`: 카드 스타일
- `tabs.tsx`: 탭 스타일
- `accordion.tsx`: 아코디언 스타일
- `dialog.tsx`: 다이얼로그 스타일
- `resizable.tsx`: 리사이즈 가능한 패널

**수정 방법**:
1. 각 컴포넌트 파일에서 `cn()` 함수로 클래스 병합
2. Tailwind 클래스 직접 수정
3. Variant 추가/수정

**예시** (`components/ui/button.tsx`):
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        // 새로운 variant 추가
        custom: "bg-custom-color text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        // 새로운 size 추가
        large: "h-12 px-6 py-3",
      },
    },
  }
)
```

### 3.2 커스텀 컴포넌트

#### `components/CodeEditor.tsx`
**수정 사항**:
- 코드 에디터 스타일
- 라인 하이라이트 색상
- 폰트 크기 및 간격

#### `components/PreviewPanel.tsx`
**수정 사항**:
- 미리보기 패널 스타일
- 탭 스타일
- iframe 스타일

#### `components/HintPanel.tsx`
**수정 사항**:
- 힌트 패널 스타일
- 아코디언 스타일
- 마크다운 렌더링 스타일

---

## 4. 반경(Border Radius) 수정

### 4.1 전역 반경 설정

**파일**: `app/globals.css`

**수정 위치**:
```css
:root {
  --radius: 0.5rem;  /* 기본 반경 */
}
```

### 4.2 컴포넌트별 반경

**파일**: `tailwind.config.ts`

**수정 위치**:
```typescript
borderRadius: {
  lg: 'var(--radius)',           // 큰 반경
  md: 'calc(var(--radius) - 2px)', // 중간 반경
  sm: 'calc(var(--radius) - 4px)'  // 작은 반경
}
```

---

## 5. 폰트 및 타이포그래피

### 5.1 폰트 설정

**파일**: `app/layout.tsx`

**수정 위치**:
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={inter.className}>
      {/* ... */}
    </html>
  )
}
```

**다른 폰트 사용**:
```tsx
import { Noto_Sans_KR } from 'next/font/google'

const notoSans = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['400', '500', '700']
})
```

### 5.2 타이포그래피 스타일

**파일**: `app/globals.css` 또는 각 컴포넌트

**Tailwind 클래스 사용**:
- `text-sm`, `text-base`, `text-lg`: 폰트 크기
- `font-normal`, `font-medium`, `font-bold`: 폰트 굵기
- `leading-tight`, `leading-normal`, `leading-relaxed`: 줄 간격

---

## 6. 애니메이션 및 트랜지션

### 6.1 커스텀 애니메이션

**파일**: `tailwind.config.ts`

**수정 위치**:
```typescript
keyframes: {
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' }
  },
  // 새로운 애니메이션 추가
  'fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' }
  }
},
animation: {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'fade-in': 'fade-in 0.3s ease-in'
}
```

### 6.2 트랜지션

**Tailwind 클래스 사용**:
- `transition-all`: 모든 속성 트랜지션
- `duration-200`, `duration-300`: 지속 시간
- `ease-in`, `ease-out`, `ease-in-out`: 이징 함수

---

## 7. 다크 모드 설정

### 7.1 다크 모드 활성화

**파일**: `tailwind.config.ts`

**설정**:
```typescript
darkMode: ["class"],  // 클래스 기반 다크 모드
```

### 7.2 다크 모드 색상

**파일**: `app/globals.css`

**수정 위치**:
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* 다크 모드 색상 변수 */
}
```

### 7.3 다크 모드 토글

**구현 위치**: 필요시 `app/layout.tsx` 또는 별도 컴포넌트

**예시**:
```tsx
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark')
}
```

---

## 8. 반응형 레이아웃 패턴

### 8.1 모바일 퍼스트 접근

**기본 패턴**:
```tsx
// 모바일 기본, 데스크톱에서 변경
<div className="flex flex-col md:flex-row">
  <div className="w-full md:w-1/2">...</div>
</div>
```

### 8.2 그리드 레이아웃

**예시**:
```tsx
// 1열(모바일) → 2열(태블릿) → 3열(데스크톱)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* ... */}
</div>
```

### 8.3 숨김/표시 제어

**예시**:
```tsx
{/* 모바일에서만 표시 */}
<div className="block md:hidden">모바일 메뉴</div>

{/* 데스크톱에서만 표시 */}
<div className="hidden md:block">데스크톱 메뉴</div>
```

---

## 9. 수정 우선순위 가이드

### 우선순위 1: 전역 테마 변경
1. `app/globals.css` - 색상 변수 수정
2. `tailwind.config.ts` - 브레이크포인트, 컨테이너 설정

### 우선순위 2: 레이아웃 변경
1. `app/lallenges/[id]/page.tsx` - 페이지 레이아웃
2. `components/CodeEditor.tsx`, `PreviewPanel.tsx` - 주요 컴포넌트

### 우선순위 3: 개별 컴포넌트 스타일
1. `components/ui/*` - shadcn/ui 컴포넌트
2. 각 페이지의 인라인 스타일

---

## 10. 체크리스트

### 테마 수정 시
- [ ] `app/globals.css`의 CSS 변수 확인
- [ ] 라이트/다크 모드 모두 테스트
- [ ] 접근성 대비율 확인 (WCAG 2.1 AA 기준: 4.5:1)
- [ ] 모든 브라우저에서 색상 일관성 확인

### 반응형 수정 시
- [ ] 모바일 (375px ~ 640px) 테스트
- [ ] 태블릿 (768px ~ 1024px) 테스트
- [ ] 데스크톱 (1280px+) 테스트
- [ ] 가로/세로 모드 모두 테스트
- [ ] 터치 영역 크기 확인 (최소 44x44px)

### 컴포넌트 수정 시
- [ ] 모든 variant 상태 확인
- [ ] 호버/포커스 상태 확인
- [ ] 다크 모드에서의 가시성 확인
- [ ] 스크린 리더 테스트

---

## 11. 유용한 리소스

### 색상 도구
- [HSL Picker](https://hslpicker.com/) - HSL 색상 선택
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - 대비율 확인
- [Coolors](https://coolors.co/) - 색상 팔레트 생성

### 반응형 테스트
- Chrome DevTools 디바이스 모드
- [Responsive Design Checker](https://responsivedesignchecker.com/)

### Tailwind CSS
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)

---

## 12. 주의사항

1. **CSS 변수 사용**: 색상은 항상 CSS 변수를 통해 관리하여 일관성 유지
2. **접근성 고려**: 색상 대비율, 포커스 표시, 키보드 네비게이션 확인
3. **성능**: 불필요한 애니메이션 제거, 이미지 최적화
4. **브라우저 호환성**: 주요 브라우저에서 테스트
5. **다크 모드**: 라이트/다크 모드 모두에서 동작 확인

---

## 13. 예시: 테마 색상 변경

### 단계별 가이드

1. **색상 선택**
   - 예: Primary 색상을 파란색에서 보라색으로 변경

2. **HSL 값 계산**
   - 보라색 HSL: `270 50% 50%`

3. **globals.css 수정**
   ```css
   :root {
     --primary: 270 50% 50%;  /* 변경 */
   }
   ```

4. **다크 모드도 수정**
   ```css
   .dark {
     --primary: 270 50% 60%;  /* 다크 모드용 약간 밝게 */
   }
   ```

5. **대비율 확인**
   - Primary와 Primary-foreground의 대비율이 4.5:1 이상인지 확인

6. **테스트**
   - 모든 버튼, 링크에서 색상 확인
   - 다크 모드에서도 확인

---

이 가이드를 참고하여 디자인 테마와 반응형 레이아웃을 체계적으로 수정할 수 있습니다.


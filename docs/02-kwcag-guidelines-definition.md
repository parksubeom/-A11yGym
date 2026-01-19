# 02. KWCAG 2.2 지침 TypeScript 상수 정의

## 작업 개요

KWCAG 2.2 (한국형 웹 콘텐츠 접근성 지침) 기준의 웹 접근성 지침을 TypeScript 상수로 정의하여 프로젝트 전역에서 사용할 수 있도록 구현합니다.

## 요구사항 분석

### 기능 요구사항
- KWCAG 2.2 기준의 모든 웹 접근성 지침을 TypeScript 상수로 정의
- 각 지침은 다음 정보를 포함:
  - 코드 (예: "1.1.1")
  - 제목 (한글)
  - 상세 설명 (한글)
  - 원칙 (perceivable, operable, understandable, robust)
  - 준수 수준 (A, AA, AAA)
- 지침 검색 및 필터링을 위한 유틸리티 함수 제공

### 기술 요구사항
- 파일 위치: `/constants/kwcag-guidelines.ts`
- TypeScript 타입 안전성 보장
- 기존 `constants/kwcag.ts`와의 호환성 유지

## 추론 과정

### 1. 데이터 구조 설계

**문제**: 사용자가 제공한 타입 정의와 실제 WCAG 2.2 구조를 어떻게 매핑할 것인가?

**분석**:
- WCAG 2.2는 4가지 원칙(POUR)으로 구성: Perceivable, Operable, Understandable, Robust
- 각 원칙 아래 여러 지침(Guidelines)이 있고, 각 지침 아래 성공 기준(Success Criteria)이 있음
- 사용자가 제공한 예시는 성공 기준 수준의 정보를 포함

**결정**:
- `code`: 성공 기준 코드 (예: "1.1.1", "2.1.1")
- `title`: 지침 제목 (한글)
- `description`: 상세 설명 (한글)
- `principle`: 원칙 (소문자로 통일: 'perceivable', 'operable', 'understandable', 'robust')
- `level`: 준수 수준 ('A', 'AA', 'AAA')

**이유**:
- 사용자가 제공한 타입 정의를 기반으로 하되, `level` 필드를 추가하여 필터링 기능 강화
- 원칙은 소문자로 통일하여 일관성 유지
- 한글 제목과 설명으로 한국 사용자에게 친숙하게 제공

### 2. 데이터 소스 결정

**문제**: 전체 KWCAG 2.2 지침 데이터를 어떻게 수집할 것인가?

**분석**:
- 사용자가 CSV 파일을 보유하고 있다고 언급
- 웹 검색 결과 WCAG 2.2의 주요 성공 기준 목록 확인 가능
- 사용자가 제공한 예시 4개를 기반으로 구조 확장 가능

**결정**:
1. 먼저 WCAG 2.2의 주요 성공 기준을 기반으로 기본 구조 생성
2. 사용자에게 CSV 파일 제공을 요청하여 전체 데이터 반영
3. 현재는 주요 지침들을 포함하여 기본 구조 완성

**이유**:
- 즉시 사용 가능한 기본 구조 제공
- CSV 파일이 제공되면 쉽게 확장 가능한 구조로 설계
- 점진적 개선 접근

### 3. 유틸리티 함수 설계

**문제**: 지침 데이터를 어떻게 효율적으로 검색하고 필터링할 것인가?

**분석**:
- 코드로 특정 지침 찾기
- 원칙별로 그룹화
- 준수 수준별로 필터링
- 원칙과 준수 수준 조합 필터링

**결정**:
다음 유틸리티 함수 제공:
- `getGuidelineByCode(code: string)`: 코드로 지침 찾기
- `getGuidelinesByPrinciple(principle: Principle)`: 원칙별 필터링
- `getGuidelinesByLevel(level: KWCAGLevel)`: 준수 수준별 필터링
- `getGuidelinesByPrincipleAndLevel(principle, level)`: 원칙과 준수 수준 조합 필터링

**이유**:
- 일반적인 사용 사례를 커버하는 유틸리티 함수 제공
- 타입 안전성 보장
- 재사용 가능한 함수로 코드 중복 방지

## 구현 방법

### 1. 타입 정의

**파일 경로**: `constants/kwcag-guidelines.ts`

**구현 내용**:
```typescript
export type Principle = 'perceivable' | 'operable' | 'understandable' | 'robust'

export type KWCAGLevel = 'A' | 'AA' | 'AAA'

export interface Guideline {
  code: string
  title: string
  description: string
  principle: Principle
  level: KWCAGLevel
}
```

**이유**:
- `Principle`: 4가지 원칙을 타입으로 정의하여 타입 안전성 보장
- `KWCAGLevel`: 기존 `constants/kwcag.ts`의 타입과 호환
- `Guideline`: 각 지침의 모든 필수 정보를 포함하는 인터페이스

### 2. 지침 데이터 배열

**구현 내용**:
```typescript
export const KWCAG_GUIDELINES: Guideline[] = [
  // 1. 인식 가능성 (Perceivable)
  {
    code: '1.1.1',
    title: '적절한 대체 텍스트 제공',
    description: '텍스트 아닌 콘텐츠는 그 의미나 용도를 인식할 수 있도록 대체 텍스트를 제공해야 한다.',
    principle: 'perceivable',
    level: 'A',
  },
  // ... 더 많은 지침들
]
```

**포함된 지침 카테고리**:

#### 1. 인식 가능성 (Perceivable) - 13개
- 1.1.1: 적절한 대체 텍스트 제공 (A)
- 1.3.1: 정보 및 관계성 (A)
- 1.3.2: 의미 있는 순서 (A)
- 1.3.3: 감각적 특성 (A)
- 1.4.1: 색상 사용 (A)
- 1.4.2: 오디오 제어 (A)
- 1.4.3: 텍스트 콘텐츠의 명도 대비 (AA)
- 1.4.4: 텍스트 크기 조정 (AA)
- 1.4.5: 이미지 텍스트 (AA)
- 1.4.10: 리플로우 (AA)
- 1.4.11: 비텍스트 콘텐츠의 명도 대비 (AA)
- 1.4.12: 텍스트 간격 (AA)
- 1.4.13: 호버 또는 포커스 시 콘텐츠 (AA)

#### 2. 운용 가능성 (Operable) - 18개
- 2.1.1: 키보드 사용 보장 (A)
- 2.1.2: 키보드 트랩 없음 (A)
- 2.1.4: 문자 단축키 (A)
- 2.2.1: 시간 조절 (A)
- 2.2.2: 일시정지, 중지, 숨김 (A)
- 2.3.1: 세 번의 깜빡임 (A)
- 2.4.1: 건너뛰기 링크 (A)
- 2.4.2: 제목 제공 (A)
- 2.4.3: 포커스 순서 (A)
- 2.4.4: 링크 목적 (A)
- 2.4.5: 여러 가지 방법 (AA)
- 2.4.6: 제목과 레이블 (AA)
- 2.4.7: 포커스 표시 (AA)
- 2.5.1: 포인터 제스처 (A)
- 2.5.2: 포인터 취소 (A)
- 2.5.3: 레이블이 없는 이름 (A)
- 2.5.4: 동작 취소 (A)
- 2.5.5: 타깃 크기 (AAA)
- 2.5.6: 동시 입력 메커니즘 (AAA)
- 2.5.7: 드래깅 동작 (AA)
- 2.5.8: 타깃 크기 (최소) (AA)

#### 3. 이해 가능성 (Understandable) - 15개
- 3.1.1: 페이지의 언어 (A)
- 3.1.2: 부분의 언어 (AA)
- 3.2.1: 포커스 시 (A)
- 3.2.2: 입력 시 (A)
- 3.2.3: 일관된 탐색 (AA)
- 3.2.4: 일관된 식별 (AA)
- 3.3.1: 오류 식별 (A)
- 3.3.2: 레이블 제공 (A)
- 3.3.3: 오류 제안 (AA)
- 3.3.4: 오류 방지 (법적, 금융, 데이터) (AA)
- 3.3.5: 도움말 (AAA)
- 3.3.6: 오류 방지 (모든) (AAA)
- 3.3.7: 접근 가능한 인증 (최소) (AA)
- 3.3.8: 접근 가능한 인증 (확장) (AAA)
- 3.3.9: 접근 가능한 인증 (대안) (AAA)

#### 4. 견고성 (Robust) - 3개
- 4.1.1: 구문 분석 (A)
- 4.1.2: 이름, 역할, 값 (A)
- 4.1.3: 상태 메시지 (AA)

**총 49개 지침 포함**

**이유**:
- WCAG 2.2의 주요 성공 기준을 포함
- 사용자가 제공한 예시 4개 모두 포함
- 한국어 제목과 설명으로 한국 사용자에게 친숙
- 원칙별로 주석으로 그룹화하여 가독성 향상

### 3. 유틸리티 함수 구현

**구현 내용**:

#### 3.1. 코드로 지침 찾기
```typescript
export function getGuidelineByCode(code: string): Guideline | undefined {
  return KWCAG_GUIDELINES.find((guideline) => guideline.code === code)
}
```

**이유**: 특정 코드로 지침을 빠르게 찾을 수 있음

#### 3.2. 원칙별 필터링
```typescript
export function getGuidelinesByPrinciple(principle: Principle): Guideline[] {
  return KWCAG_GUIDELINES.filter((guideline) => guideline.principle === principle)
}
```

**이유**: 원칙별로 지침을 그룹화하여 표시할 때 유용

#### 3.3. 준수 수준별 필터링
```typescript
export function getGuidelinesByLevel(level: KWCAGLevel): Guideline[] {
  return KWCAG_GUIDELINES.filter((guideline) => guideline.level === level)
}
```

**이유**: 특정 준수 수준(A, AA, AAA)의 지침만 필터링할 때 유용

#### 3.4. 원칙과 준수 수준 조합 필터링
```typescript
export function getGuidelinesByPrincipleAndLevel(
  principle: Principle,
  level: KWCAGLevel
): Guideline[] {
  return KWCAG_GUIDELINES.filter(
    (guideline) => guideline.principle === principle && guideline.level === level
  )
}
```

**이유**: 더 세밀한 필터링이 필요할 때 사용

### 4. 한글 변환 맵

**구현 내용**:
```typescript
export const PRINCIPLE_NAMES: Record<Principle, string> = {
  perceivable: '인식 가능성',
  operable: '운용 가능성',
  understandable: '이해 가능성',
  robust: '견고성',
}

export const LEVEL_NAMES: Record<KWCAGLevel, string> = {
  A: 'A',
  AA: 'AA',
  AAA: 'AAA',
}
```

**이유**:
- UI에서 원칙 이름을 한글로 표시할 때 사용
- 타입 안전성 보장
- 일관된 한글 표기

## 사용 예시

### 기본 사용
```typescript
import { KWCAG_GUIDELINES, getGuidelineByCode } from '@/constants/kwcag-guidelines'

// 모든 지침 가져오기
const allGuidelines = KWCAG_GUIDELINES

// 특정 지침 찾기
const guideline = getGuidelineByCode('1.1.1')
// {
//   code: '1.1.1',
//   title: '적절한 대체 텍스트 제공',
//   description: '텍스트 아닌 콘텐츠는 그 의미나 용도를 인식할 수 있도록 대체 텍스트를 제공해야 한다.',
//   principle: 'perceivable',
//   level: 'A'
// }
```

### 필터링 사용
```typescript
import {
  getGuidelinesByPrinciple,
  getGuidelinesByLevel,
  getGuidelinesByPrincipleAndLevel,
} from '@/constants/kwcag-guidelines'

// 인식 가능성 원칙의 모든 지침
const perceivableGuidelines = getGuidelinesByPrinciple('perceivable')

// A 수준의 모든 지침
const levelAGuidelines = getGuidelinesByLevel('A')

// 인식 가능성 원칙의 AA 수준 지침만
const perceivableAA = getGuidelinesByPrincipleAndLevel('perceivable', 'AA')
```

### UI에서 사용
```typescript
import { PRINCIPLE_NAMES, LEVEL_NAMES } from '@/constants/kwcag-guidelines'

// 원칙 이름 한글로 표시
const principleName = PRINCIPLE_NAMES['perceivable'] // '인식 가능성'

// 준수 수준 표시
const levelName = LEVEL_NAMES['AA'] // 'AA'
```

## 실행 순서

이 문서만으로 같은 결과물을 만들기 위한 단계별 실행 순서:

1. **파일 생성**
   ```bash
   touch constants/kwcag-guidelines.ts
   ```

2. **타입 정의 작성**
   - `Principle` 타입 정의
   - `KWCAGLevel` 타입 정의 (기존 `constants/kwcag.ts`와 호환)
   - `Guideline` 인터페이스 정의

3. **지침 데이터 배열 작성**
   - WCAG 2.2 기준의 주요 성공 기준을 한글로 번역하여 배열에 추가
   - 원칙별로 주석으로 그룹화
   - 총 49개 지침 포함

4. **유틸리티 함수 작성**
   - `getGuidelineByCode`
   - `getGuidelinesByPrinciple`
   - `getGuidelinesByLevel`
   - `getGuidelinesByPrincipleAndLevel`

5. **한글 변환 맵 작성**
   - `PRINCIPLE_NAMES`
   - `LEVEL_NAMES`

6. **타입 체크**
   ```bash
   npx tsc --noEmit
   ```

## CSV 파일 반영 방법 (향후 작업)

사용자가 CSV 파일을 제공하면 다음 방법으로 데이터를 반영할 수 있습니다:

1. **CSV 파일 구조 확인**
   - 코드, 제목, 설명, 원칙, 준수 수준 컬럼 확인

2. **데이터 변환 스크립트 작성** (선택사항)
   ```typescript
   // scripts/import-kwcag-csv.ts
   import { parse } from 'csv-parse/sync'
   import fs from 'fs'
   
   const csvData = fs.readFileSync('kwcag-guidelines.csv', 'utf-8')
   const records = parse(csvData, { columns: true })
   
   const guidelines = records.map((record: any) => ({
     code: record.code,
     title: record.title,
     description: record.description,
     principle: record.principle.toLowerCase(),
     level: record.level,
   }))
   
   // kwcag-guidelines.ts 파일에 반영
   ```

3. **수동 반영**
   - CSV 파일의 각 행을 `Guideline` 객체로 변환하여 `KWCAG_GUIDELINES` 배열에 추가

## 검증 방법

1. **타입 체크**
   ```bash
   npx tsc --noEmit
   ```

2. **린트 체크**
   ```bash
   npm run lint
   ```

3. **사용 테스트**
   ```typescript
   // 테스트 파일 생성
   import { KWCAG_GUIDELINES, getGuidelineByCode } from '@/constants/kwcag-guidelines'
   
   // 모든 지침이 올바른 구조를 가지고 있는지 확인
   console.assert(KWCAG_GUIDELINES.length > 0, '지침이 하나 이상 있어야 함')
   
   // 특정 지침 찾기 테스트
   const guideline = getGuidelineByCode('1.1.1')
   console.assert(guideline !== undefined, '1.1.1 지침을 찾을 수 있어야 함')
   console.assert(guideline?.title === '적절한 대체 텍스트 제공', '제목이 올바르게 설정되어야 함')
   ```

## 주의사항

1. **데이터 완전성**: 현재 49개 지침을 포함했으나, WCAG 2.2의 모든 성공 기준이 포함되지 않을 수 있습니다. CSV 파일이 제공되면 전체 데이터를 반영해야 합니다.

2. **한글 번역 정확성**: 현재 한글 번역은 일반적인 WCAG 2.2 번역을 기반으로 하였습니다. 공식 KWCAG 문서와 차이가 있을 수 있으므로, CSV 파일이나 공식 문서를 참고하여 정확성을 확인해야 합니다.

3. **타입 호환성**: `KWCAGLevel` 타입은 기존 `constants/kwcag.ts`의 타입과 호환되도록 설계되었습니다.

4. **성능**: 현재 배열 기반 검색을 사용하고 있습니다. 지침 수가 많아지면 (수백 개 이상) 인덱스나 Map 기반 검색을 고려할 수 있습니다.

## 다음 단계

1. CSV 파일이 제공되면 전체 데이터 반영
2. 지침별 상세 설명, 예시, 체크리스트 등 추가 정보 확장
3. 지침 검색 기능 구현 (제목, 설명 텍스트 검색)
4. 지침별 관련 컴포넌트나 예시 코드 링크 추가

## 참고 자료

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [한국형 웹 콘텐츠 접근성 지침 (KWCAG)](https://www.wah.or.kr/)
- [WCAG 2.2 Success Criteria](https://www.w3.org/WAI/WCAG22/quickref/)


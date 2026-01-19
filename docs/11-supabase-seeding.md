# 11. Supabase DB 초기화 시딩 스크립트

## 작업 개요

Supabase 데이터베이스 초기화를 위한 시딩 스크립트를 구현했습니다.

- 파일: `scripts/seed.ts`
- 포함 데이터:
  - **Guidelines**: 5개의 핵심 KWCAG 지침 (1.1.1, 2.1.1, 2.4.2, 3.3.2, 1.4.3)
  - **Challenges**: 각 지침에 대응하는 5개의 챌린지

## 요구사항 분석

### 기능 요구사항
- Supabase DB에 Guideline 데이터 삽입
- Supabase DB에 Challenge 데이터 삽입
- 중복 데이터 방지 (upsert 사용)
- 에러 핸들링 및 로깅

### 데이터 요구사항
- 최소 5개의 핵심 지침에 대한 챌린지
- 각 챌린지는 `initialCode`, `solutionCode`, `validationRule` 포함
- 실제 접근성 오류 케이스 기반

## 추론 과정

### 1. 시딩 스크립트 구조

**문제**: Node.js 환경에서 TypeScript를 실행하고 Supabase에 데이터를 삽입하는 방법은?

**결정**: `tsx` 사용 + `dotenv`로 환경 변수 로드
- `tsx`: TypeScript를 직접 실행할 수 있는 도구
- `dotenv`: `.env.local` 파일에서 환경 변수 로드
- 서비스 키 사용: 관리자 권한으로 데이터 삽입

**이유**:
- Next.js 프로젝트와 동일한 환경 변수 사용
- TypeScript 타입 체크 유지
- 빠른 실행 속도

### 2. 데이터 중복 처리

**문제**: 스크립트를 여러 번 실행해도 안전하게 동작해야 함

**결정**: `upsert` 사용 + `onConflict` 옵션
- `guidelines`: `code` 기준으로 중복 처리
- `challenges`: `id` 기준으로 중복 처리

**이유**:
- 기존 데이터가 있으면 업데이트, 없으면 삽입
- 멱등성(idempotent) 보장

### 3. 챌린지 데이터 선택

**문제**: 어떤 지침을 선택하고 어떤 챌린지를 만들 것인가?

**결정**: 5개의 핵심 지침 선택
1. **1.1.1** (적절한 대체 텍스트 제공) - 가장 기본적이고 자주 발생하는 오류
2. **2.1.1** (키보드 사용 보장) - 키보드 접근성의 핵심
3. **2.4.2** (제목 제공) - 사용자 요청 예시
4. **3.3.2** (레이블 제공) - 폼 접근성의 핵심
5. **1.4.3** (명도 대비) - 시각적 접근성의 핵심

**이유**:
- 다양한 원칙(perceivable, operable, understandable) 커버
- 실제로 자주 발생하는 오류 케이스
- 난이도 다양화 (easy, medium)

## 구현 방법

### 1. 환경 변수 설정

**파일 경로**: `.env.local` (프로젝트 루트)

**필요한 변수**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**이유**:
- 서비스 키는 관리자 권한을 가지므로 데이터 삽입에 필요
- 공개 키(ANON_KEY)로는 제한된 작업만 가능

### 2. Guideline 데이터 구조

**구현 내용**:
```typescript
const guidelines = [
  {
    code: '1.1.1',
    title: '적절한 대체 텍스트 제공',
    description: '...',
    principle: 'perceivable',
    level: 'A',
  },
  // ...
]
```

**이유**:
- KWCAG 지침의 핵심 정보 포함
- `code`를 unique key로 사용

### 3. Challenge 데이터 구조

**구현 내용**:
```typescript
const challenges = [
  {
    id: 'challenge-1-1-1-alt-text',
    title: '이미지 대체 텍스트 누락',
    description: '...',
    guidelineCode: '1.1.1',
    difficulty: 'easy',
    hint: '...',
    initialCode: `<img src="/logo.png">`,
    solutionCode: `<img src="/logo.png" alt="회사 로고">`,
    validationRule: {
      type: 'regex',
      pattern: String.raw`<img\b[^>]*\balt\s*=\s*"(?!\s*")[^"]+"\b[^>]*>`,
      flags: 'gmi',
      shouldMatch: true,
      message: '...',
    },
  },
  // ...
]
```

**이유**:
- 실제 오류 케이스 기반
- `validationRule`로 자동 검증 가능
- `guidelineCode`로 Guideline과 연결

### 4. 시딩 실행 로직

**구현 내용**:
```typescript
async function seed() {
  // 1. Guidelines 삽입
  const { data, error } = await supabase
    .from('guidelines')
    .upsert(guidelines, { onConflict: 'code' })
    .select()

  // 2. Challenges 삽입
  const { data, error } = await supabase
    .from('challenges')
    .upsert(challenges, { onConflict: 'id' })
    .select()
}
```

**이유**:
- 순차 실행으로 의존성 보장
- 에러 발생 시 즉시 중단
- 삽입된 데이터 개수 로깅

## 실행 방법

### 1. 환경 변수 설정

`.env.local` 파일에 다음 변수를 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**서비스 키 찾기**:
1. Supabase 대시보드 → Settings → API
2. "service_role" 키 복사 (⚠️ 절대 공개하지 마세요!)

### 2. 스크립트 실행

```bash
npm run seed
```

또는 직접 실행:

```bash
npx tsx scripts/seed.ts
```

### 3. 실행 결과 확인

성공 시:
```
🌱 Supabase DB 시딩 시작...

📋 Guidelines 삽입 중...
✅ 5개의 Guideline 삽입 완료

🎯 Challenges 삽입 중...
✅ 5개의 Challenge 삽입 완료

🎉 시딩 완료!

삽입된 데이터:
- Guidelines: 5개
- Challenges: 5개
```

## 포함된 데이터

### Guidelines (5개)

1. **1.1.1** - 적절한 대체 텍스트 제공 (perceivable, A)
2. **2.1.1** - 키보드 사용 보장 (operable, A)
3. **2.4.2** - 제목 제공 (operable, A)
4. **3.3.2** - 레이블 제공 (understandable, A)
5. **1.4.3** - 텍스트 콘텐츠의 명도 대비 (perceivable, AA)

### Challenges (5개)

1. **challenge-1-1-1-alt-text**
   - 문제: 이미지에 alt 속성 누락
   - 난이도: easy
   - 검증: alt 속성 존재 및 비어있지 않음

2. **challenge-2-1-1-keyboard**
   - 문제: div에 onClick만 있고 키보드 접근 불가
   - 난이도: medium
   - 검증: role="button" + tabIndex={0} 존재

3. **challenge-2-4-2-page-title**
   - 문제: title이 "문서"로만 되어 있음
   - 난이도: easy
   - 검증: title 태그에 구체적인 텍스트 포함

4. **challenge-3-3-2-form-label**
   - 문제: input에 label 연결 없음
   - 난이도: easy
   - 검증: label(for) + input(id) 연결 확인

5. **challenge-1-4-3-contrast**
   - 문제: 텍스트와 배경 대비 부족
   - 난이도: medium
   - 검증: 색상 값 명시 여부 (실제 대비 계산은 별도 필요)

## 실행 순서

이 문서만으로 같은 결과물을 만들기 위한 단계별 실행 순서:

1. **의존성 설치**
   ```bash
   npm i dotenv tsx --save-dev
   ```

2. **package.json에 seed 스크립트 추가**
   ```json
   "scripts": {
     "seed": "tsx scripts/seed.ts"
   }
   ```

3. **scripts/seed.ts 파일 생성**
   - 환경 변수 로드 (dotenv)
   - Supabase 클라이언트 생성 (서비스 키 사용)
   - Guidelines 데이터 정의
   - Challenges 데이터 정의
   - upsert로 데이터 삽입

4. **환경 변수 설정**
   - `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 추가

5. **스크립트 실행**
   ```bash
   npm run seed
   ```

## 검증 방법

1. **Supabase 대시보드 확인**
   - Table Editor에서 `guidelines`, `challenges` 테이블 확인
   - 데이터가 정상적으로 삽입되었는지 확인

2. **중복 실행 테스트**
   ```bash
   npm run seed
   npm run seed  # 다시 실행해도 에러 없이 동작해야 함
   ```

3. **애플리케이션에서 확인**
   - 챌린지 목록 페이지에서 데이터가 표시되는지 확인
   - 각 챌린지 상세 페이지가 정상적으로 로드되는지 확인

## 주의사항

1. **서비스 키 보안**: `SUPABASE_SERVICE_ROLE_KEY`는 절대 공개 저장소에 커밋하지 마세요. `.env.local`은 `.gitignore`에 포함되어 있어야 합니다.

2. **테이블 스키마**: Supabase에 다음 테이블이 존재해야 합니다:
   - `guidelines`: `code` (unique), `title`, `description`, `principle`, `level`
   - `challenges`: `id` (unique), `title`, `description`, `guidelineCode`, `difficulty`, `hint`, `initialCode`, `solutionCode`, `validationRule` (JSON)

3. **validationRule 형식**: `validationRule`은 JSON으로 저장되므로, Supabase에서 JSONB 타입으로 정의해야 합니다.

## 다음 단계

1. Supabase 테이블 스키마 생성 및 마이그레이션 스크립트 작성
2. 더 많은 챌린지 데이터 추가
3. 사용자 진행 상황(user_progress) 테이블 시딩
4. 시딩 스크립트를 CI/CD 파이프라인에 통합


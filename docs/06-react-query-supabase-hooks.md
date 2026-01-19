# 06. Supabase 데이터 통신을 위한 React Query 커스텀 훅

## 작업 개요

Supabase와의 데이터 통신을 위한 React Query 커스텀 훅을 구현했습니다.

- 파일: `hooks/useQueries.ts`
- 구현된 훅:
  - `useGuidelines()`: 전체 지침 목록 조회 (캐싱 적용)
  - `useChallenge(id)`: 특정 챌린지 상세 조회
  - `useUserProgress(userId)`: 사용자의 챌린지 풀이 현황 조회
  - `useSubmitSolution()`: 정답 제출 및 결과 저장 (Mutation)

각 훅은 `isLoading`, `error`, `data`를 반환하고 타입 안정성을 보장합니다.

## 요구사항 분석

### 기능 요구사항
- 전체 지침 목록 조회 (캐싱 적용)
- 특정 챌린지 상세 조회
- 사용자 진행 상황 조회
- 정답 제출 및 결과 저장 (Mutation)

### 기술 요구사항
- React Query의 `useQuery`, `useMutation` 사용
- Supabase 클라이언트 활용 (`lib/supabase.ts`)
- 타입 안정성 보장
- 적절한 에러 핸들링 및 로딩 상태 처리

## 추론 과정

### 1. Query Key 구조 설계

**문제**: 여러 훅에서 사용할 쿼리 키를 어떻게 체계적으로 관리할 것인가?

**결정**: `queryKeys` 객체로 중앙화하여 관리
- `guidelines`: 전체 지침 목록
- `challenge(id)`: 특정 챌린지
- `userProgress(userId)`: 사용자 진행 상황

**이유**:
- 쿼리 키를 한 곳에서 관리하여 일관성 유지
- 타입 안정성 보장 (as const 사용)
- 무효화(invalidate) 시 재사용 가능

### 2. 캐싱 전략

**문제**: 각 데이터의 특성에 맞는 캐싱 시간을 어떻게 설정할 것인가?

**결정**:
- `useGuidelines()`: 5분 (지침 목록은 자주 변경되지 않음)
- `useChallenge(id)`: 2분 (챌린지 상세는 중간 빈도)
- `useUserProgress(userId)`: 30초 (진행 상황은 자주 업데이트됨)

**이유**:
- 데이터 변경 빈도에 따라 캐싱 시간 조정
- 사용자 경험과 데이터 최신성의 균형

### 3. Mutation 후 캐시 무효화

**문제**: 정답 제출 후 진행 상황을 어떻게 최신 상태로 갱신할 것인가?

**결정**: `onSuccess` 콜백에서 `queryClient.invalidateQueries()` 호출

**이유**:
- Mutation 성공 시 관련 쿼리를 자동으로 무효화하여 최신 데이터로 갱신
- 사용자가 즉시 업데이트된 진행 상황을 확인할 수 있음

### 4. 타입 정의

**문제**: Supabase에서 반환되는 데이터와 프로젝트 내부 타입을 어떻게 매핑할 것인가?

**결정**:
- `ChallengeDetail`: `Challenge` 타입을 확장하여 DB 필드 추가
- `UserProgress`: 진행 상황 전용 타입 정의
- `SubmitSolutionParams`, `SubmitSolutionResponse`: Mutation 타입 정의

**이유**:
- 타입 안정성 보장
- DB 스키마와 코드 타입의 일관성 유지

## 구현 방법

### 1. 타입 정의

**파일 경로**: `hooks/useQueries.ts`

**구현 내용**:
```typescript
export interface ChallengeDetail extends Challenge {
  id: string
  createdAt?: string
  updatedAt?: string
}

export interface UserProgress {
  id: string
  userId: string
  challengeId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  submittedAt?: string
  completedAt?: string
  attempts: number
  lastSubmittedCode?: string
}
```

**이유**:
- 기존 `Challenge` 타입을 확장하여 DB 필드 추가
- 진행 상황을 명확하게 표현하는 타입 정의

### 2. Query Keys 중앙화

**구현 내용**:
```typescript
export const queryKeys = {
  guidelines: ['guidelines'] as const,
  challenge: (id: string) => ['challenge', id] as const,
  userProgress: (userId: string) => ['userProgress', userId] as const,
} as const
```

**이유**:
- 쿼리 키를 한 곳에서 관리하여 일관성 유지
- 타입 안정성 보장

### 3. useGuidelines() 구현

**구현 내용**:
- Supabase `guidelines` 테이블에서 전체 목록 조회
- `code` 기준 오름차순 정렬
- 캐싱 시간: 5분

**이유**:
- 지침 목록은 자주 변경되지 않으므로 긴 캐싱 시간 적용
- 정렬을 통해 일관된 순서 보장

### 4. useChallenge(id) 구현

**구현 내용**:
- Supabase `challenges` 테이블에서 특정 챌린지 조회
- `enabled` 옵션으로 id가 있을 때만 실행
- Not found 에러 처리

**이유**:
- 조건부 쿼리 실행으로 불필요한 요청 방지
- Not found 케이스를 null로 반환하여 UI에서 처리 가능

### 5. useUserProgress(userId) 구현

**구현 내용**:
- Supabase `user_progress` 테이블에서 사용자 진행 상황 조회
- `userId` 기준 필터링 및 최신순 정렬
- `enabled` 옵션으로 userId가 있을 때만 실행

**이유**:
- 사용자별 진행 상황을 효율적으로 조회
- 최신 데이터 우선 표시

### 6. useSubmitSolution() 구현

**구현 내용**:
- Mutation으로 정답 제출 및 결과 저장
- 기존 진행 상황이 있으면 업데이트, 없으면 생성
- 성공 시 진행 상황 쿼리 무효화

**이유**:
- 진행 상황을 효율적으로 관리
- 제출 후 즉시 최신 상태로 갱신

## 사용 예시

### 기본 사용
```typescript
import { useGuidelines, useChallenge, useUserProgress, useSubmitSolution } from '@/hooks/useQueries'

// 지침 목록 조회
function GuidelinesList() {
  const { data, isLoading, error } = useGuidelines()
  
  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러: {error.message}</div>
  
  return (
    <ul>
      {data?.map(guideline => (
        <li key={guideline.code}>{guideline.title}</li>
      ))}
    </ul>
  )
}

// 챌린지 상세 조회
function ChallengeDetail({ challengeId }: { challengeId: string }) {
  const { data, isLoading, error } = useChallenge(challengeId)
  
  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러: {error.message}</div>
  if (!data) return <div>챌린지를 찾을 수 없습니다.</div>
  
  return <div>{data.title}</div>
}

// 정답 제출
function SubmitButton({ challengeId, userId, code, isValid }: Props) {
  const { mutate, isPending } = useSubmitSolution()
  
  const handleSubmit = () => {
    mutate(
      { challengeId, userId, code, isValid },
      {
        onSuccess: (data) => {
          alert(data.message)
        },
        onError: (error) => {
          alert(`제출 실패: ${error.message}`)
        },
      }
    )
  }
  
  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? '제출 중...' : '제출'}
    </button>
  )
}
```

## 실행 순서

이 문서만으로 같은 결과물을 만들기 위한 단계별 실행 순서:

1. **타입 정의 작성**
   - `ChallengeDetail`, `UserProgress`, `SubmitSolutionParams`, `SubmitSolutionResponse` 인터페이스 정의

2. **Query Keys 정의**
   - `queryKeys` 객체로 쿼리 키 중앙화

3. **useGuidelines() 구현**
   - `useQuery`로 지침 목록 조회
   - 캐싱 시간 5분 설정

4. **useChallenge(id) 구현**
   - `useQuery`로 챌린지 상세 조회
   - `enabled` 옵션으로 조건부 실행

5. **useUserProgress(userId) 구현**
   - `useQuery`로 진행 상황 조회
   - `enabled` 옵션으로 조건부 실행

6. **useSubmitSolution() 구현**
   - `useMutation`으로 정답 제출
   - `onSuccess`에서 쿼리 무효화

## 검증 방법

1. **타입 체크**
   ```bash
   npx tsc --noEmit
   ```

2. **사용 테스트**
   - 각 훅을 컴포넌트에서 사용하여 정상 동작 확인
   - 로딩/에러 상태 처리 확인

## 주의사항

1. **Supabase 테이블 구조**: 실제 Supabase에 다음 테이블이 존재해야 합니다:
   - `guidelines`: 지침 목록
   - `challenges`: 챌린지 상세
   - `user_progress`: 사용자 진행 상황

2. **환경 변수**: `.env.local`에 Supabase URL과 키가 설정되어 있어야 합니다.

3. **인증**: 실제 사용 시 Supabase 인증을 통해 `userId`를 안전하게 가져와야 합니다.

## 다음 단계

1. Supabase 테이블 스키마 생성 및 마이그레이션
2. 인증 연동 (Supabase Auth)
3. 에러 바운더리 추가
4. 낙관적 업데이트(Optimistic Update) 적용


# 04. 실습용 챌린지 예시 데이터 구조 (TypeScript)

## 작업 개요

실습(코드 수정) 기반의 접근성 트레이닝을 위해, **챌린지 데이터 타입**과 **샘플 챌린지 3개**를 작성했습니다.

- 파일 위치: `constants/sample-challenges.ts`
- 샘플 시나리오(실제 오류 케이스 기반):
  - 1.1.1 이미지 대체 텍스트 누락
  - 2.1.1 키보드 접근 불가
  - 3.3.2 폼 레이블 누락

각 챌린지는 다음을 반드시 포함합니다.

- `initialCode`: 오류가 있는 초기 코드
- `solutionCode`: 정답(개선된) 코드
- `validationRule`: 자동 검증 규칙(정규식 등)

## 요구사항 분석

### 데이터가 가져야 할 최소 요건

- **식별 가능**: 챌린지를 고유하게 구분할 수 있어야 함 (`id`)
- **설명 가능**: 제목/설명/힌트를 제공해야 함 (`title`, `description`, `hint`)
- **지침 연결**: 어떤 성공 기준을 다루는지 표시해야 함 (`guidelineCode`)
- **실습 가능**: 시작/정답 코드가 있어야 함 (`initialCode`, `solutionCode`)
- **자동 채점 가능**: 단순한 자동 검증 룰이 있어야 함 (`validationRule`)

## 설계(추론 과정)

### 1) `guidelineCode`는 "1.1.1" 형태를 유지

샘플 시나리오가 WCAG/KWCAG 성공 기준 코드(예: `1.1.1`, `2.1.1`, `3.3.2`)를 기준으로 주어졌기 때문에,
데이터 타입에서도 이를 그대로 보존했습니다.

> 참고: 현재 프로젝트에는 CSV 기반 KWCAG 체크리스트(`constants/kwcag-guidelines.ts`, code=1~33)가 별도로 존재합니다.  
> 향후에는 두 데이터를 매핑하는 레이어(예: `guidelineCode` ↔ `kwcagChecklistId`)를 추가할 수 있습니다.

### 2) `validationRule`은 확장 가능한 구조로 설계

이번 요구사항은 “정규식 등”을 언급했으므로, 우선 `regex` 기반 규칙을 제공했습니다.
향후에는 AST 파싱, DOM 검사, eslint 룰 기반 검증 등으로 확장 가능하도록 유니언 타입으로 구성했습니다.

## 구현 내용

### 파일: `constants/sample-challenges.ts`

- 타입:
  - `ChallengeDifficulty`
  - `ValidationRule` (현재는 `regex` 지원)
  - `Challenge`
- 데이터:
  - `SAMPLE_CHALLENGES` (readonly)

## 샘플 챌린지 구성

### 1) 이미지 대체 텍스트 누락 (1.1.1)

- `initialCode`: `alt`가 없는 `<img>`
- `solutionCode`: 의미를 설명하는 `alt` 제공
- `validationRule`: `alt="..."` (비어있지 않음) 매칭

### 2) 키보드 접근 불가 (2.1.1)

- `initialCode`: `<div onClick=...>`만 존재
- `solutionCode`: `role="button"`, `tabIndex={0}`, `onKeyDown`으로 Enter/Space 처리
- `validationRule`: `role="button"` + `tabIndex={0|"0"}` 매칭

### 3) 폼 레이블 누락 (3.3.2)

- `initialCode`: `<input>`에 label/aria-label/title 모두 없음
- `solutionCode`: `<label htmlFor="email">` + `<input id="email">`
- `validationRule`: label의 `htmlFor="email"` 과 input의 `id="email"` 동시 존재 매칭

## 사용 예시

```ts
import { SAMPLE_CHALLENGES } from "@/constants/sample-challenges"

const challenge = SAMPLE_CHALLENGES[0]
console.log(challenge.title, challenge.guidelineCode)
```

## 검증 로직 연결 가이드(간단)

현재 `validationRule.type === "regex"`인 경우:

1. 사용자 코드 문자열을 입력받고
2. `new RegExp(pattern, flags ?? "gms")` 생성
3. `shouldMatch`(기본 true)에 따라 `test()` 결과를 판정

> 주의: 정규식만으로 완벽한 접근성 검증은 불가능합니다.  
> 그러나 “학습용 실습”에서는 최소 요건 체크로 충분히 유용합니다.

## 다음 단계

- `validationRule`에 `multiRegex` 또는 `customFn`(샌드박스 실행) 추가
- `guidelineCode`(1.1.1 등)와 CSV 체크리스트(code=1~33) 간 매핑 테이블 추가
- 챌린지를 KWCAG 지침 상세(설명/주의사항/예시 코드)와 연결

## 커밋 메시지(복붙용)

```text
feat: 실습용 챌린지 샘플 데이터 추가

- 챌린지 데이터 타입 및 검증 규칙(정규식) 정의
- 접근성 오류 케이스 기반 샘플 3종 추가(1.1.1/2.1.1/3.3.2)
- 페이즈 문서화 추가(docs/04-sample-challenges-data-structure.md)
```



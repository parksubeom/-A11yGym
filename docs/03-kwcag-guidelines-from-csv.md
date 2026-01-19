# 03. KWCAG 지침을 CSV로부터 자동 생성

## 작업 개요

사용자가 제공한 `웹 접근성 텍스트 gems.CSV` 파일(Windows 인코딩)로부터 **KWCAG 지침(고유 번호 1~33)**을 추출해,
프로젝트에서 바로 사용할 수 있는 TypeScript 상수 파일 `constants/kwcag-guidelines.ts`를 **자동 생성**합니다.

핵심 목표는 다음 2가지입니다.

- **실제 데이터 반영**: CSV에 포함된 지침 원문을 그대로 반영
- **재현 가능성**: 동일 CSV만 있으면 언제든 같은 TS 결과물을 재생성

## 문제와 해결

### 1) CSV 인코딩 깨짐(CP949/EUC-KR)

CSV가 CP949 계열로 저장되어 있어, UTF-8 환경에서 읽으면 한글이 깨집니다.  
따라서 먼저 **UTF-8(무 BOM)** 으로 변환한 파일을 workspace(`docs/kwcag-guidelines.utf8.csv`)에 생성합니다.

### 2) 파일 잠금(Windows에서 CSV가 다른 프로세스에 의해 열림)

Windows에서 엑셀/미리보기 등으로 파일이 열려 있으면 `.ReadAllBytes()`가 실패할 수 있습니다.  
이를 피하기 위해 PowerShell 스크립트에서 `FileShare.ReadWrite`로 파일을 읽도록 구현했습니다.

### 3) CSV 구조

변환된 UTF-8 CSV의 헤더(일부)는 다음과 같습니다.

- `고유 번호`
- `지침_원문`
- `지침`
- `오류 유형`
- `디바이스`
- `문제점 및 개선 방안`
- `점검/문구 사용 시 주의사항`

CSV는 **지침(고유 번호)** 별로 여러 케이스(오류 유형/개선 방안)가 반복되는 형태입니다.  
이번 단계의 목표는 “지침 목록”이므로 `고유 번호` 단위로 **중복을 제거**하여 1개씩만 추출합니다.

## 구현 산출물

### 1) UTF-8 변환 스크립트

- 파일: `scripts/convert-kwcag-csv.ps1`
- 입력: Downloads 폴더에서 이름에 `gems`가 포함된 `.csv`
- 출력: `docs/kwcag-guidelines.utf8.csv`

### 2) TS 상수 자동 생성 스크립트

- 파일: `scripts/generate-kwcag-guidelines.mjs`
- 입력: `docs/kwcag-guidelines.utf8.csv`
- 출력: `constants/kwcag-guidelines.ts`

CSV의 `지침_원문` 컬럼은 대략 다음 형식입니다.

- `(...제목...) 설명...`

따라서 다음 규칙으로 분해합니다.

- **title**: 첫 `(` 와 `)` 사이 텍스트
- **description**: `)` 이후의 텍스트(trim)
- **code**: `고유 번호`(예: `"1"`, `"10"`)

### 3) principle(POUR) 매핑

CSV에는 원칙 컬럼이 없으므로, KWCAG 체크리스트 고유 번호 그룹을 기준으로 다음과 같이 매핑했습니다.

- 1~9: `perceivable`
- 10~20: `operable`
- 21~31: `understandable`
- 32~33: `robust`

> CSV의 항목명/내용(예: 10번이 “키보드 사용 보장”, 29번이 “레이블 제공”)과 일치하도록 경험 기반으로 설정했으며,
> 향후 CSV에 원칙 컬럼이 제공되면 그 값을 우선하도록 개선 가능합니다.

## 실행 순서 (이 문서만으로 재현)

1. **(선택) CSV를 열고 있는 프로그램(엑셀/미리보기)을 닫기**

2. **CSV를 UTF-8로 변환**

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\convert-kwcag-csv.ps1
```

3. **TS 상수 파일 자동 생성**

```powershell
node .\scripts\generate-kwcag-guidelines.mjs
```

4. **생성 결과 확인**

- `docs/kwcag-guidelines.utf8.csv` 생성됨
- `constants/kwcag-guidelines.ts` 생성/갱신됨

## 결과 요약

- `constants/kwcag-guidelines.ts`는 **CSV 기반 AUTO-GENERATED 파일**로 갱신됨
- 총 **33개 지침**이 `KWCAG_GUIDELINES` 배열로 생성됨
- 타입은 사용자 요구사항에 맞게 다음 형태를 제공:
  - `Guideline { code, title, description, principle }`



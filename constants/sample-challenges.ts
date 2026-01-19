export type ChallengeDifficulty = "easy" | "medium" | "hard"

export type ValidationRule =
  | {
      type: "regex"
      /**
       * 정규식 문자열 (예: "<img[^>]*\\salt=...").
       * - JS RegExp로 바로 컴파일 가능해야 합니다.
       * - 대부분의 경우 "solutionCode"에서 매칭되어야 합니다.
       */
      pattern: string
      /**
       * 정규식 플래그 (기본값: "gms")
       */
      flags?: string
      /**
       * 매칭되어야 하는지 여부 (기본값: true)
       */
      shouldMatch?: boolean
      /**
       * 실패 시 안내 메시지
       */
      message: string
    }

export interface Challenge {
  id: string
  title: string
  description: string
  /**
   * KWCAG/WCAG Success Criteria 코드
   * 예: "1.1.1", "2.1.1", "3.3.2"
   */
  guidelineCode: string
  difficulty: ChallengeDifficulty
  hint: string
  /**
   * 사용자가 처음 마주하는 코드 (오류가 포함된 상태)
   */
  initialCode: string
  /**
   * 정답(해결된) 코드
   */
  solutionCode: string
  /**
   * 자동 검증(정규식 등) 룰
   */
  validationRule: ValidationRule
}

/**
 * 실습용 샘플 챌린지
 * - 실제 접근성 오류 케이스를 단순화한 예시
 * - 각 챌린지는 "initialCode" → "solutionCode"로 개선되며
 *   "validationRule"로 최소 요건을 자동 판별할 수 있게 구성합니다.
 */
export const SAMPLE_CHALLENGES: readonly Challenge[] = [
  {
    id: "missing-alt-1-1-1",
    title: "이미지 대체 텍스트 누락",
    description:
      "의미를 가진 이미지에는 대체 텍스트(alt)가 필요합니다. alt가 없거나 비어 있으면 스크린 리더 사용자는 이미지의 의미를 알 수 없습니다.",
    guidelineCode: "1.1.1",
    difficulty: "easy",
    hint: "이미지의 의미를 설명하는 alt 속성이 필요합니다.",
    initialCode: `<img src="/promo-banner.png">`,
    solutionCode: `<img src="/promo-banner.png" alt="프로모션 배너: 겨울 세일 최대 50% 할인">`,
    validationRule: {
      type: "regex",
      // alt 속성이 존재하고, 값이 비어있지 않은지 확인
      pattern: String.raw`<img\b[^>]*\balt\s*=\s*"(?!\s*")[^"]+"\b[^>]*>`,
      flags: "gmi",
      shouldMatch: true,
      message: `img 요소에 비어있지 않은 alt 속성이 필요합니다. 예: <img ... alt="설명">`,
    },
  },
  {
    id: "keyboard-inaccessible-2-1-1",
    title: "키보드 접근 불가 클릭 요소",
    description:
      "클릭 가능한 요소는 키보드로도 접근/작동 가능해야 합니다. div/span에 onClick만 있으면 기본적으로 포커스가 가지 않습니다.",
    guidelineCode: "2.1.1",
    difficulty: "medium",
    hint: "div 요소는 기본적으로 포커스를 받을 수 없습니다. role과 tabIndex, 키보드 이벤트를 고려하세요.",
    initialCode: `<div onClick={() => alert("clicked")}>구독하기</div>`,
    solutionCode: `<div
  role="button"
  tabIndex={0}
  onClick={() => alert("clicked")}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") alert("clicked")
  }}
>
  구독하기
</div>`,
    validationRule: {
      type: "regex",
      // role="button" + tabIndex={0} 또는 tabIndex="0" 둘 다 허용
      pattern: String.raw`<div\b[^>]*\brole\s*=\s*"(?:button)"[^>]*\btabIndex\s*=\s*(?:\{0\}|"0")[^>]*>`,
      flags: "gmi",
      shouldMatch: true,
      message: `클릭 가능한 div에는 role="button"과 tabIndex={0}(또는 "0")를 제공해 키보드 포커스가 가능해야 합니다.`,
    },
  },
  {
    id: "missing-label-3-3-2",
    title: "폼 레이블 누락",
    description:
      "입력 필드에는 레이블이 있어야 합니다. label(for/id) 연결 또는 aria-label/aria-labelledby/title 등을 통해 스크린 리더가 용도를 알 수 있어야 합니다.",
    guidelineCode: "3.3.2",
    difficulty: "easy",
    hint: "스크린 리더 사용자가 입력 필드의 용도를 알 수 없습니다. label 연결 또는 aria-label 등을 제공하세요.",
    initialCode: `<input type="email" placeholder="Email">`,
    solutionCode: `<label htmlFor="email">이메일</label>
<input id="email" type="email" autoComplete="email" />`,
    validationRule: {
      type: "regex",
      // label htmlFor="email" 과 input id="email" 동시 존재 여부를 최소 확인
      pattern: String.raw`<label\b[^>]*\bhtmlFor\s*=\s*"(?:email)"[^>]*>.*?</label>[\s\S]*?<input\b[^>]*\bid\s*=\s*"(?:email)"`,
      flags: "gmi",
      shouldMatch: true,
      message: `input에는 연결된 label이 필요합니다. 예: <label htmlFor="email">...</label> + <input id="email" ... />`,
    },
  },
] as const



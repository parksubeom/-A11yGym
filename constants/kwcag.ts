// KWCAG (한국형 웹 콘텐츠 접근성 지침) 상수 데이터

export const KWCAG_LEVELS = {
  A: 'A',
  AA: 'AA',
  AAA: 'AAA',
} as const

export type KWCAGLevel = typeof KWCAG_LEVELS[keyof typeof KWCAG_LEVELS]


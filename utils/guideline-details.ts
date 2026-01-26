/**
 * 가이드라인별 상세 정보 및 예시
 */

import { SAMPLE_CHALLENGES } from '@/constants/sample-challenges'

export interface GuidelineDetail {
  /** 체크리스트 ID */
  checklistId: string
  /** 주요 포인트 (간단한 체크리스트) */
  keyPoints?: string[]
  /** 간단한 예시 */
  example?: string
  /** 관련 챌린지 ID 목록 */
  relatedChallenges?: string[]
}

/**
 * 가이드라인별 상세 정보
 */
export const GUIDELINE_DETAILS: Record<string, Partial<GuidelineDetail>> = {
  '1': {
    keyPoints: [
      '정보성 이미지는 의미 있는 alt 텍스트 제공',
      '장식용 이미지는 alt="" 사용',
      '복잡한 이미지는 상세 설명 추가',
    ],
    example: '<img src="logo.png" alt="회사 로고" />',
    relatedChallenges: ['informative-image-banner', 'decorative-image-icon', 'complex-image-chart'],
  },
  '3': {
    keyPoints: [
      '데이터 테이블에는 <th>와 scope 속성 사용',
      '<caption>으로 표 제목 제공',
      '복잡한 표는 headers 속성으로 연결',
    ],
    example: '<table><caption>요금 안내</caption><thead><tr><th scope="col">항목</th></tr></thead></table>',
    relatedChallenges: ['table-header-missing'],
  },
  '6': {
    keyPoints: [
      '색상만으로 정보 전달 금지',
      '텍스트, 아이콘, 패턴 등 추가 단서 제공',
      '필수 항목은 색상 외 수단으로 표시',
    ],
    example: '<span class="required" aria-label="필수">*</span>',
    relatedChallenges: ['color-only-required'],
  },
  '8': {
    keyPoints: [
      '본문 텍스트: 4.5:1 이상',
      '큰 텍스트(18pt 이상): 3:1 이상',
      '대비 계산 도구 활용 권장',
    ],
    example: 'color: #111111; background: #ffffff; /* 16.6:1 */',
    relatedChallenges: ['contrast-low-text'],
  },
  '10': {
    keyPoints: [
      '모든 기능은 키보드로 접근 가능',
      'div/span에 onClick만 사용 금지',
      'role과 tabIndex 적절히 사용',
    ],
    example: '<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>클릭</div>',
    relatedChallenges: ['keyboard-clickable-div'],
  },
  '11': {
    keyPoints: [
      '포커스 표시는 시각적으로 명확',
      'outline 제거 시 대체 스타일 제공',
      'focus-visible 사용 권장',
    ],
    example: 'button:focus-visible { outline: 2px solid blue; }',
    relatedChallenges: ['focus-outline-removed'],
  },
  '17': {
    keyPoints: [
      '반복 영역 건너뛰기 링크 제공',
      '본문 바로가기 링크는 첫 번째 요소',
      'tabindex="-1"로 초점 이동',
    ],
    example: '<a href="#main">본문 바로가기</a>',
    relatedChallenges: ['skip-link-missing'],
  },
  '19': {
    keyPoints: [
      '링크 텍스트는 목적을 명확히',
      '"더보기", "클릭" 등 모호한 텍스트 지양',
      '문맥과 함께 이해 가능하도록',
    ],
    example: '<a href="/news">뉴스 더보기</a>',
    relatedChallenges: ['link-text-ambiguous'],
  },
  '29': {
    keyPoints: [
      '모든 입력 필드에 레이블 제공',
      '<label for="id"> 사용',
      'placeholder는 레이블 대체 불가',
    ],
    example: '<label for="email">이메일</label><input id="email" type="email" />',
    relatedChallenges: ['form-label-missing'],
  },
  '32': {
    keyPoints: [
      'id 값은 페이지 내 고유',
      '태그 열고 닫기 정확히',
      '중첩 관계 올바르게',
    ],
    example: '<label for="email1">이메일</label><input id="email1" />',
    relatedChallenges: ['duplicate-id'],
  },
}

/**
 * 체크리스트 ID로 상세 정보 가져오기
 */
export function getGuidelineDetail(checklistId: string): Partial<GuidelineDetail> {
  return GUIDELINE_DETAILS[checklistId] || {}
}

/**
 * 체크리스트 ID로 관련 챌린지 찾기
 */
export function getRelatedChallenges(checklistId: string): typeof SAMPLE_CHALLENGES[number][] {
  return SAMPLE_CHALLENGES.filter((challenge) => challenge.kwcagCode === checklistId)
}


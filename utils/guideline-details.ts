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
  '2': {
    keyPoints: [
      '동영상에 자막 파일 제공',
      '오디오 콘텐츠에 대본 제공',
      '실시간 방송은 수어 제공',
    ],
    example: '<video><track kind="captions" src="captions.vtt" /></video>',
  },
  '4': {
    keyPoints: [
      'DOM 순서와 시각적 순서 일치',
      '레이어 팝업은 첫 번째 요소로',
      '논리적 마크업 순서 유지',
    ],
    example: '<header>...</header><main>...</main><footer>...</footer>',
  },
  '5': {
    keyPoints: [
      '색상만으로 지시하지 않기',
      '위치(위/아래) 대신 명칭 사용',
      '크기/모양 대신 정확한 이름 사용',
    ],
    example: '<p>빨간색 버튼 대신 "제출 버튼" 사용</p>',
  },
  '7': {
    keyPoints: [
      '자동 재생 소리는 3초 미만',
      '정지 컨트롤 제공',
      '음소거 상태로 시작',
    ],
    example: '<audio controls muted><source src="audio.mp3" /></audio>',
  },
  '9': {
    keyPoints: [
      '이웃한 콘텐츠 구분',
      '테두리, 구분선 제공',
      '여백으로 시각적 분리',
    ],
    example: '<div style="border: 1px solid #ccc; padding: 1rem;">콘텐츠</div>',
  },
  '12': {
    keyPoints: [
      '컨트롤 크기 최소 6mm (대각선)',
      'PC: 17px × 17px 이상',
      '모바일: 24px × 24px 이상',
    ],
    example: '<button style="min-width: 44px; min-height: 44px;">클릭</button>',
  },
  '13': {
    keyPoints: [
      '단일 문자 단축키 비활성화 옵션',
      '기능키 조합 사용',
      '초점 받은 요소에서만 작동',
    ],
    example: '<button onKeyDown={(e) => e.key === "s" && e.ctrlKey && handleSave()}>저장</button>',
  },
  '14': {
    keyPoints: [
      '시간 제한 연장 기능',
      '최소 20초 남았을 때 경고',
      '제한 해제 옵션 제공',
    ],
    example: '<button onClick={extendTime}>시간 연장</button>',
  },
  '15': {
    keyPoints: [
      '자동 변경 콘텐츠 정지 버튼',
      '캐러셀 이전/다음 버튼',
      '인디케이터 제공',
    ],
    example: '<button onClick={pauseCarousel}>정지</button>',
  },
  '16': {
    keyPoints: [
      '초당 3~50회 깜빡임 금지',
      '사전 경고 제공',
      '피할 수 있는 방법 제공',
    ],
    example: '/* CSS 애니메이션 제한: animation-duration: 0.3s 이상 */',
  },
  '18': {
    keyPoints: [
      '페이지마다 고유한 <title>',
      '콘텐츠 블록에 <h1>~<h6>',
      '제목 수준 건너뛰지 않기',
    ],
    example: '<h1>메인 제목</h1><h2>부제목</h2>',
  },
  '20': {
    keyPoints: [
      '전자책 페이지 번호 표시',
      '페이지 이동 기능 제공',
      '일관된 위치 정보 유지',
    ],
    example: '<div>페이지 <span>1</span> / <span>100</span></div>',
  },
  '21': {
    keyPoints: [
      '다중 포인터 대신 단일 탭',
      '스와이프 대신 버튼 제공',
      '제스처 대체 UI 제공',
    ],
    example: '<button onClick={handleAction}>대체 버튼</button>',
  },
  '22': {
    keyPoints: [
      'up 이벤트에서 기능 실행',
      '취소 기능 제공',
      '되돌리기 기능 제공',
    ],
    example: '<button onMouseUp={handleClick}>클릭</button>',
  },
  '23': {
    keyPoints: [
      '레이블과 접근 가능한 이름 일치',
      '시각적 텍스트를 네임에 포함',
      'aria-label은 보조적 사용',
    ],
    example: '<button>저장</button> /* "저장"이 접근 가능한 이름 */',
  },
  '24': {
    keyPoints: [
      '동작 기반 기능 비활성화 옵션',
      'UI 구성요소로 대체 제공',
      '설정에서 제어 가능',
    ],
    example: '<label><input type="checkbox" /> 동작 기반 기능 비활성화</label>',
  },
  '25': {
    keyPoints: [
      '<html lang="ko"> 속성 제공',
      '다국어 섹션은 lang 속성',
      '스크린 리더 음성 엔진 선택',
    ],
    example: '<html lang="ko"><body>한국어 콘텐츠</body></html>',
  },
  '26': {
    keyPoints: [
      '새 창 열기 시 title 속성',
      '초점 이동으로 맥락 변화 금지',
      '사용자 의도 확인 후 실행',
    ],
    example: '<a href="/page" target="_blank" title="새 창에서 열림">링크</a>',
  },
  '27': {
    keyPoints: [
      '도움 정보 일관된 위치',
      '각 페이지 동일한 순서',
      '접근 경로 통일',
    ],
    example: '<nav><a href="/help">도움말</a></nav>',
  },
  '28': {
    keyPoints: [
      '오류 메시지 명확히 제공',
      '오류 항목으로 초점 이동',
      '입력 내용 유지',
    ],
    example: '<div role="alert">이메일 형식이 올바르지 않습니다.</div>',
  },
  '30': {
    keyPoints: [
      '인지 기능 테스트 대체 방법',
      '비밀번호 저장 기능',
      '복사/붙여넣기 허용',
    ],
    example: '<input type="text" autoComplete="username" />',
  },
  '31': {
    keyPoints: [
      '반복 입력 자동 완성',
      'autocomplete 속성 사용',
      '이전 입력값 선택 가능',
    ],
    example: '<input type="email" autoComplete="email" />',
  },
  '33': {
    keyPoints: [
      '웹 애플리케이션 접근성 준수',
      'ARIA 속성 적절히 사용',
      '키보드 접근성 보장',
    ],
    example: '<div role="application" aria-label="계산기">...</div>',
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


/**
 * 챌린지 리소스 타입 정의
 * 실습에 필요한 이미지, 비디오 등의 에셋을 정의합니다.
 */
export interface ChallengeAsset {
  /**
   * 리소스 타입
   */
  type: 'image' | 'video'
  
  /**
   * 리소스 URL
   * 예: "https://placehold.co/600x400"
   */
  url: string
  
  /**
   * 멘토링용 정답/설명 데이터
   * 이미지 대체 텍스트 실습 등에서 사용됩니다.
   */
  altDescription?: string
}

/**
 * 챌린지 데이터 모델
 * 
 * 사용자가 접근성 문제를 해결하는 실습 환경을 정의합니다.
 * - `initialCode`: 문제가 포함된 초기 코드 (부모 요소 Context 포함, 멀티라인)
 * - `highlightLines`: 에디터에서 강조할 문제 영역 라인 번호
 * - `assets`: 실습에 필요한 이미지/비디오 리소스
 * - `environment`: HTML 또는 React 환경 구분
 */
export interface Challenge {
  /**
   * 챌린지 고유 식별자
   */
  id: string
  
  /**
   * KWCAG 내부 체크리스트 ID
   * 예: "1", "29", "32"
   * 
   * 이 ID를 통해 한글 제목과 WCAG 코드를 가져올 수 있습니다.
   * @see utils/guideline-helper.ts
   */
  kwcagCode: string
  
  /**
   * 챌린지 제목
   */
  title: string
  
  /**
   * 챌린지 설명
   */
  description: string
  
  /**
   * 챌린지 난이도
   */
  difficulty: 'easy' | 'medium' | 'hard'
  
  /**
   * 실습 환경 설정
   * - 'html': 순수 HTML 환경
   * - 'react': React JSX 환경
   */
  environment: 'html' | 'react'
  
  /**
   * 초기 코드 (문제가 포함된 상태)
   * 
   * 부모 요소(Context)를 포함한 멀티라인 문자열을 지원합니다.
   * 예:
   * ```html
   * <div className="card">
   *   <img src="/promo.png" />
   *   <p>프로모션 내용</p>
   * </div>
   * ```
   */
  initialCode: string
  
  /**
   * 에디터에서 강조할 문제 라인 번호
   * 
   * 배열 형태로 시작 라인과 끝 라인을 지정합니다.
   * 예: [3, 5]는 3번째 줄부터 5번째 줄까지 강조
   * 예: [7]은 7번째 줄만 강조
   * 
   * 지정하지 않으면 전체 코드가 표시됩니다.
   */
  highlightLines?: number[]
  
  /**
   * 실습에 필요한 리소스 배열
   * 
   * 이미지 대체 텍스트 실습 등에서 사용됩니다.
   * 각 에셋은 `url`과 선택적 `altDescription`을 포함합니다.
   */
  assets?: ChallengeAsset[]
  
  /**
   * 정답 코드 (해결된 상태)
   * 
   * 사용자가 목표로 해야 할 올바른 코드입니다.
   */
  solutionCode: string
}


import type { Challenge, ChallengeAsset } from '@/types/challenge'

/**
 * 실전 챌린지 데이터
 * 
 * 실제 웹 개발에서 자주 발생하는 접근성 문제를 다룹니다.
 * 각 챌린지는 부모 요소(Context)를 포함한 멀티라인 코드로 구성되어
 * 실제 개발 환경과 유사한 상황을 제공합니다.
 */
export const SAMPLE_CHALLENGES: readonly Challenge[] = [
  {
    id: 'informative-image-banner',
    kwcagCode: '1.1.1',
    title: '정보성 이미지 대체 텍스트 누락 (이벤트 배너)',
    description:
      '의미를 가진 이미지에는 대체 텍스트(alt)가 필요합니다. 이벤트 배너나 프로모션 이미지는 사용자에게 중요한 정보를 전달하므로, alt 속성에 이미지가 전달하는 내용을 명확하게 작성해야 합니다.',
    environment: 'react',
    initialCode: `<div className="promotion">
  <h2>봄맞이 특가</h2>
  <img src="https://placehold.co/800x300/FF6B6B/FFFFFF?text=Spring+Sale+50%25+OFF" />
  <button>지금 구매하기</button>
</div>`,
    highlightLines: [3],
    assets: [
      {
        type: 'image',
        url: 'https://placehold.co/800x300/FF6B6B/FFFFFF?text=Spring+Sale+50%25+OFF',
        altDescription: '봄맞이 50% 할인 이벤트 배너: 화려한 봄 꽃과 함께 "50% OFF" 할인 문구가 표시된 프로모션 이미지',
      },
    ],
    solutionCode: `<div className="promotion">
  <h2>봄맞이 특가</h2>
  <img 
    src="https://placehold.co/800x300/FF6B6B/FFFFFF?text=Spring+Sale+50%25+OFF" 
    alt="Spring Sale 50% OFF"
  />
  <button>지금 구매하기</button>
</div>`,
  },
  {
    id: 'decorative-image-icon',
    kwcagCode: '1.1.1',
    title: '장식용 이미지 중복 낭독 (아이콘)',
    description:
      '장식용 이미지는 스크린 리더에서 읽히지 않아야 합니다. 버튼이나 링크 안에 텍스트가 이미 있는 경우, 아이콘 이미지의 alt는 빈 문자열(alt="")로 설정하여 중복 낭독을 방지해야 합니다.',
    environment: 'react',
    initialCode: `<button className="settings-button">
  <img 
    src="https://placehold.co/24x24/4A90E2/FFFFFF?text=⚙" 
    alt="설정"
  />
  <span>설정</span>
</button>`,
    highlightLines: [2],
    assets: [
      {
        type: 'image',
        url: 'https://placehold.co/24x24/4A90E2/FFFFFF?text=⚙',
        altDescription: '장식용 톱니바퀴 아이콘 (alt=""로 설정해야 함)',
      },
    ],
    solutionCode: `<button className="settings-button">
  <img 
    src="https://placehold.co/24x24/4A90E2/FFFFFF?text=⚙" 
    alt=""
  />
  <span>설정</span>
</button>`,
  },
  {
    id: 'complex-image-chart',
    kwcagCode: '1.1.1',
    title: '복잡한 이미지 정보 부족 (차트)',
    description:
      '복잡한 이미지(차트, 그래프, 다이어그램 등)는 단순한 alt 텍스트만으로는 충분하지 않을 수 있습니다. 구체적인 수치와 데이터를 포함하거나, aria-describedby를 사용하여 상세 설명을 연결해야 합니다.',
    environment: 'html',
    initialCode: `<figure className="sales-chart">
  <img 
    src="https://placehold.co/600x400/9B59B6/FFFFFF?text=Annual+Sales+Chart" 
    alt="차트"
  />
  <figcaption>연도별 매출 현황</figcaption>
</figure>`,
    highlightLines: [2],
    assets: [
      {
        type: 'image',
        url: 'https://placehold.co/600x400/9B59B6/FFFFFF?text=Annual+Sales+Chart',
        altDescription:
          '연도별 매출 막대 그래프: 2020년 1억원, 2021년 1.5억원, 2022년 2억원, 2023년 2.5억원으로 지속적인 성장 추세를 보임',
      },
    ],
    solutionCode: `<figure className="sales-chart">
  <img 
    src="https://placehold.co/600x400/9B59B6/FFFFFF?text=Annual+Sales+Chart" 
    alt="연도별 매출 막대 그래프: 2020년 1억원, 2021년 1.5억원, 2022년 2억원, 2023년 2.5억원으로 지속적인 성장 추세"
    aria-describedby="chart-description"
  />
  <figcaption id="chart-description">연도별 매출 현황</figcaption>
</figure>`,
  },
] as const

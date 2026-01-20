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
    difficulty: 'easy',
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
    difficulty: 'easy',
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
      '복잡한 이미지(차트, 그래프, 다이어그램 등)는 단순한 alt 텍스트만으로는 충분하지 않을 수 있습니다. 구체적인 수치와 데이터를 포함하거나, aria-describedby를 사용하여 상세 설명을 연결해야 합니다.\n\n**이 차트의 정보:**\n이 이미지는 연도별 매출 막대 그래프를 보여줍니다. 2020년 1억원, 2021년 1.5억원, 2022년 2억원, 2023년 2.5억원으로 지속적인 성장 추세를 보입니다.',
    difficulty: 'medium',
    environment: 'html',
    initialCode: `<figure className="sales-chart">
  <img 
    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450'%3E%3Crect width='600' height='450' fill='%23f8f9fa'/%3E%3Ctext x='300' y='30' text-anchor='middle' font-size='20' font-weight='bold' fill='%23333'%3E연도별 매출 현황%3C/text%3E%3Cg transform='translate(50,60)'%3E%3Crect x='0' y='250' width='100' height='60' fill='%239B59B6'/%3E%3Ctext x='50' y='240' text-anchor='middle' font-size='12' fill='%23333' font-weight='bold'%3E1억원%3C/text%3E%3Ctext x='50' y='330' text-anchor='middle' font-size='18' fill='%23333' font-weight='bold'%3E2020%3C/text%3E%3Crect x='150' y='190' width='100' height='120' fill='%239B59B6'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='12' fill='%23333' font-weight='bold'%3E1.5억원%3C/text%3E%3Ctext x='200' y='330' text-anchor='middle' font-size='18' fill='%23333' font-weight='bold'%3E2021%3C/text%3E%3Crect x='300' y='130' width='100' height='180' fill='%239B59B6'/%3E%3Ctext x='350' y='120' text-anchor='middle' font-size='12' fill='%23333' font-weight='bold'%3E2억원%3C/text%3E%3Ctext x='350' y='330' text-anchor='middle' font-size='18' fill='%23333' font-weight='bold'%3E2022%3C/text%3E%3Crect x='450' y='70' width='100' height='240' fill='%239B59B6'/%3E%3Ctext x='500' y='60' text-anchor='middle' font-size='12' fill='%23333' font-weight='bold'%3E2.5억원%3C/text%3E%3Ctext x='500' y='330' text-anchor='middle' font-size='18' fill='%23333' font-weight='bold'%3E2023%3C/text%3E%3C/g%3E%3C/svg%3E" 
    alt="차트"
  />
  <figcaption>연도별 매출 현황</figcaption>
</figure>`,
    highlightLines: [2],
    assets: [
      {
        type: 'image',
        url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="450"%3E%3Crect width="600" height="450" fill="%23f8f9fa"/%3E%3Ctext x="300" y="30" text-anchor="middle" font-size="20" font-weight="bold" fill="%23333"%3E연도별 매출 현황%3C/text%3E%3Cg transform="translate(50,60)"%3E%3Crect x="0" y="250" width="100" height="60" fill="%239B59B6"/%3E%3Ctext x="50" y="240" text-anchor="middle" font-size="12" fill="%23333" font-weight="bold"%3E1억원%3C/text%3E%3Ctext x="50" y="330" text-anchor="middle" font-size="18" fill="%23333" font-weight="bold"%3E2020%3C/text%3E%3Crect x="150" y="190" width="100" height="120" fill="%239B59B6"/%3E%3Ctext x="200" y="180" text-anchor="middle" font-size="12" fill="%23333" font-weight="bold"%3E1.5억원%3C/text%3E%3Ctext x="200" y="330" text-anchor="middle" font-size="18" fill="%23333" font-weight="bold"%3E2021%3C/text%3E%3Crect x="300" y="130" width="100" height="180" fill="%239B59B6"/%3E%3Ctext x="350" y="120" text-anchor="middle" font-size="12" fill="%23333" font-weight="bold"%3E2억원%3C/text%3E%3Ctext x="350" y="330" text-anchor="middle" font-size="18" fill="%23333" font-weight="bold"%3E2022%3C/text%3E%3Crect x="450" y="70" width="100" height="240" fill="%239B59B6"/%3E%3Ctext x="500" y="60" text-anchor="middle" font-size="12" fill="%23333" font-weight="bold"%3E2.5억원%3C/text%3E%3Ctext x="500" y="330" text-anchor="middle" font-size="18" fill="%23333" font-weight="bold"%3E2023%3C/text%3E%3C/g%3E%3C/svg%3E',
        altDescription:
          '연도별 매출 막대 그래프: 2020년 1억원, 2021년 1.5억원, 2022년 2억원, 2023년 2.5억원으로 지속적인 성장 추세를 보임',
      },
    ],
    solutionCode: `<figure className="sales-chart">
  <img 
    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450'%3E%3Crect width='600' height='450' fill='%23f8f9fa'/%3E%3Ctext x='300' y='30' text-anchor='middle' font-size='20' font-weight='bold' fill='%23333'%3E연도별 매출 현황%3C/text%3E%3Cg transform='translate(50,60)'%3E%3Crect x='0' y='250' width='100' height='60' fill='%239B59B6'/%3E%3Ctext x='50' y='240' text-anchor='middle' font-size='12' fill='%23333' font-weight='bold'%3E1억원%3C/text%3E%3Ctext x='50' y='330' text-anchor='middle' font-size='18' fill='%23333' font-weight='bold'%3E2020%3C/text%3E%3Crect x='150' y='190' width='100' height='120' fill='%239B59B6'/%3E%3Ctext x='200' y='180' text-anchor='middle' font-size='12' fill='%23333' font-weight='bold'%3E1.5억원%3C/text%3E%3Ctext x='200' y='330' text-anchor='middle' font-size='18' fill='%23333' font-weight='bold'%3E2021%3C/text%3E%3Crect x='300' y='130' width='100' height='180' fill='%239B59B6'/%3E%3Ctext x='350' y='120' text-anchor='middle' font-size='12' fill='%23333' font-weight='bold'%3E2억원%3C/text%3E%3Ctext x='350' y='330' text-anchor='middle' font-size='18' fill='%23333' font-weight='bold'%3E2022%3C/text%3E%3Crect x='450' y='70' width='100' height='240' fill='%239B59B6'/%3E%3Ctext x='500' y='60' text-anchor='middle' font-size='12' fill='%23333' font-weight='bold'%3E2.5억원%3C/text%3E%3Ctext x='500' y='330' text-anchor='middle' font-size='18' fill='%23333' font-weight='bold'%3E2023%3C/text%3E%3C/g%3E%3C/svg%3E" 
    alt="연도별 매출 막대 그래프: 2020년 1억원, 2021년 1.5억원, 2022년 2억원, 2023년 2.5억원으로 지속적인 성장 추세"
    aria-describedby="chart-description"
  />
  <figcaption id="chart-description">연도별 매출 현황</figcaption>
</figure>`,
  },
] as const

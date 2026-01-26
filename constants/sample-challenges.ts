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
    kwcagCode: '1', // 적절한 대체 텍스트 제공
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
    kwcagCode: '1', // 적절한 대체 텍스트 제공
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
    kwcagCode: '1', // 적절한 대체 텍스트 제공
    title: '복잡한 이미지 정보 부족 (차트)',
    description:
      '복잡한 이미지(차트, 그래프, 다이어그램 등)는 단순한 alt 텍스트만으로는 충분하지 않을 수 있습니다. 구체적인 수치와 데이터를 포함하거나, aria-describedby를 사용하여 상세 설명을 연결해야 합니다.\n\n**이 차트의 정보:**\n이 이미지는 연도별 매출 막대 그래프를 보여줍니다. 2020년 1억원, 2021년 1.5억원, 2022년 2억원, 2023년 2.5억원으로 지속적인 성장 추세를 보입니다.',
    difficulty: 'medium',
    environment: 'html',
    initialCode: `<figure className="sales-chart">
  <img 
    src="/sales-chart.svg" 
    alt="차트"
  />
  <figcaption>연도별 매출 현황</figcaption>
</figure>`,
    highlightLines: [2],
    assets: [
      {
        type: 'image',
        url: '/sales-chart.svg',
        altDescription:
          '연도별 매출 막대 그래프: 2020년 1억원, 2021년 1.5억원, 2022년 2억원, 2023년 2.5억원으로 지속적인 성장 추세를 보임',
      },
    ],
    solutionCode: `<figure className="sales-chart">
  <img 
    src="/sales-chart.svg" 
    alt="연도별 매출 막대 그래프: 2020년 1억원, 2021년 1.5억원, 2022년 2억원, 2023년 2.5억원으로 지속적인 성장 추세"
    aria-describedby="chart-description"
  />
  <figcaption id="chart-description">연도별 매출 현황</figcaption>
</figure>`,
  },
  {
    id: 'keyboard-clickable-div',
    kwcagCode: '10', // 키보드 사용 보장
    title: '키보드 접근 불가 (div onClick)',
    description:
      '클릭 이벤트만 가진 div/span은 기본적으로 키보드 포커스를 받을 수 없습니다. 키보드 사용자가 동일한 기능을 사용할 수 있도록 적절한 역할(role)과 포커스(tabIndex)를 제공해야 합니다.',
    difficulty: 'easy',
    environment: 'react',
    initialCode: `<div className="card">
  <h2>상품 상세</h2>
  <div className="cta" onClick={() => alert("구매!")}>
    지금 구매하기
  </div>
</div>`,
    highlightLines: [3],
    solutionCode: `<div className="card">
  <h2>상품 상세</h2>
  <div
    className="cta"
    role="button"
    tabIndex={0}
    onClick={() => alert("구매!")}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") alert("구매!")
    }}
  >
    지금 구매하기
  </div>
</div>`,
  },
  {
    id: 'form-label-missing',
    kwcagCode: '29', // 레이블 제공
    title: '폼 레이블 누락 (input label)',
    description:
      '입력 필드는 스크린 리더 사용자가 용도를 이해할 수 있도록 레이블이 필요합니다. <label for=\"...\">와 <input id=\"...\">를 연결해 주세요.',
    difficulty: 'easy',
    environment: 'react',
    initialCode: `<form className="signup">
  <h2>회원가입</h2>
  <input type="email" placeholder="이메일" />
  <button type="submit">가입</button>
</form>`,
    highlightLines: [3],
    solutionCode: `<form className="signup">
  <h2>회원가입</h2>
  <label htmlFor="email">이메일</label>
  <input id="email" type="email" placeholder="이메일" />
  <button type="submit">가입</button>
</form>`,
  },
  {
    id: 'skip-link-missing',
    kwcagCode: '17', // 반복 영역 건너뛰기
    title: '반복 영역 건너뛰기 링크 누락 (Skip link)',
    description:
      '반복되는 영역(헤더/내비게이션)을 건너뛰고 본문으로 바로 이동할 수 있는 “본문 바로가기” 링크를 제공해야 합니다.',
    difficulty: 'easy',
    environment: 'html',
    initialCode: `<header>
  <h1>접근성 배움터</h1>
  <nav>
    <a href="#news">뉴스</a>
    <a href="#faq">FAQ</a>
  </nav>
</header>
<main id="content">
  <h2>메인 콘텐츠</h2>
  <p>여기가 본문입니다.</p>
</main>`,
    highlightLines: [1, 7],
    solutionCode: `<div class="skip-nav">
  <a href="#content">본문 바로가기</a>
</div>
<header>
  <h1>접근성 배움터</h1>
  <nav>
    <a href="#news">뉴스</a>
    <a href="#faq">FAQ</a>
  </nav>
</header>
<main id="content" tabindex="-1">
  <h2>메인 콘텐츠</h2>
  <p>여기가 본문입니다.</p>
</main>`,
  },
  {
    id: 'contrast-low-text',
    kwcagCode: '8', // 텍스트 콘텐츠의 명도 대비
    title: '텍스트 대비 부족 (저대비 본문)',
    description:
      '텍스트와 배경 간의 명도 대비가 충분하지 않으면 저시력 사용자와 모바일 환경에서 읽기 어렵습니다. 본문 텍스트의 대비를 4.5:1 이상이 되도록 조정해보세요.',
    difficulty: 'medium',
    environment: 'html',
    initialCode: `<article class="notice">
  <h2 style="color:#111111;">업데이트 안내</h2>
  <p style="color:#9ca3af; background:#ffffff;">
    오늘 20:00~21:00 동안 점검이 진행됩니다. 이용에 참고해 주세요.
  </p>
</article>`,
    highlightLines: [3, 5],
    solutionCode: `<article class="notice">
  <h2 style="color:#111111;">업데이트 안내</h2>
  <p style="color:#111111; background:#ffffff;">
    오늘 20:00~21:00 동안 점검이 진행됩니다. 이용에 참고해 주세요.
  </p>
</article>`,
  },
  {
    id: 'focus-outline-removed',
    kwcagCode: '11', // 초점 이동과 표시
    title: '포커스 표시 제거 (focus:outline-none)',
    description:
      '키보드 사용자는 포커스 표시를 통해 “현재 어디에 있는지”를 파악합니다. 포커스 아웃라인을 제거했다면, 대체 포커스 스타일을 제공해야 합니다.',
    difficulty: 'medium',
    environment: 'react',
    initialCode: `<div className="toolbar">
  <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground focus:outline-none">
    저장
  </button>
</div>`,
    highlightLines: [2],
    solutionCode: `<div className="toolbar">
  <button className="px-3 py-2 rounded-md bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
    저장
  </button>
</div>`,
  },
  {
    id: 'link-text-ambiguous',
    kwcagCode: '19', // 적절한 링크 텍스트
    title: '모호한 링크 텍스트 (더보기 반복)',
    description:
      '여러 링크가 같은 텍스트(예: “더보기”)를 가지면 스크린 리더 사용자가 목적지를 구분하기 어렵습니다. 링크 텍스트만으로 목적을 이해할 수 있게 만들어보세요.',
    difficulty: 'medium',
    environment: 'html',
    initialCode: `<section class="articles">
  <h2>공지사항</h2>
  <ul>
    <li>
      <span class="title">서비스 점검 안내</span>
      <a href="/notice/maintenance">더보기</a>
    </li>
    <li>
      <span class="title">개인정보 처리방침 변경</span>
      <a href="/notice/privacy">더보기</a>
    </li>
  </ul>
</section>`,
    highlightLines: [6, 12],
    solutionCode: `<section class="articles">
  <h2>공지사항</h2>
  <ul>
    <li>
      <span class="title">서비스 점검 안내</span>
      <a href="/notice/maintenance">서비스 점검 안내 더보기</a>
    </li>
    <li>
      <span class="title">개인정보 처리방침 변경</span>
      <a href="/notice/privacy">개인정보 처리방침 변경 더보기</a>
    </li>
  </ul>
</section>`,
  },
  {
    id: 'duplicate-id',
    kwcagCode: '32', // 마크업 오류 방지
    title: '중복 id로 인한 마크업 오류 (label 연결 깨짐)',
    description:
      '한 페이지 안에서 id 값은 중복되면 안 됩니다. id 중복은 레이블 연결, 스크린 리더 탐색, 자동완성 등에 문제를 만들 수 있습니다.',
    difficulty: 'medium',
    environment: 'html',
    initialCode: `<form class="profile">
  <label for="email">이메일</label>
  <input id="email" type="email" />

  <label for="email">이메일 확인</label>
  <input id="email" type="email" />
</form>`,
    highlightLines: [2, 7],
    solutionCode: `<form class="profile">
  <label for="email">이메일</label>
  <input id="email" type="email" />

  <label for="emailConfirm">이메일 확인</label>
  <input id="emailConfirm" type="email" />
</form>`,
  },
  {
    id: 'table-header-missing',
    kwcagCode: '3', // 표의 구성
    title: '표 헤더 미제공 (th/scope 누락)',
    description:
      '데이터 테이블은 제목 셀과 내용 셀의 관계를 명확히 해야 합니다. <th>와 scope를 사용해 헤더를 제공하세요.',
    difficulty: 'hard',
    environment: 'html',
    initialCode: `<table class="price-table">
  <caption>요금 안내</caption>
  <tr>
    <td>플랜</td>
    <td>월 요금</td>
  </tr>
  <tr>
    <td>Basic</td>
    <td>9,900원</td>
  </tr>
</table>`,
    highlightLines: [3, 6],
    solutionCode: `<table class="price-table">
  <caption>요금 안내</caption>
  <thead>
    <tr>
      <th scope="col">플랜</th>
      <th scope="col">월 요금</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Basic</th>
      <td>9,900원</td>
    </tr>
  </tbody>
</table>`,
  },
  {
    id: 'color-only-required',
    kwcagCode: '6', // 색에 무관한 콘텐츠 인식
    title: '색상만으로 필수 항목 표시 (필수 안내 누락)',
    description:
      '필수 입력을 빨간색(*)만으로 표시하면 색각 이상 사용자나 스크린 리더 사용자에게 정보가 전달되지 않을 수 있습니다. 색상 외 수단(텍스트/숨김 텍스트 등)으로 필수 여부를 제공하세요.',
    difficulty: 'hard',
    environment: 'html',
    initialCode: `<form class="checkout">
  <style>
    .required { color: #ef4444; font-weight: 700; }
  </style>
  <label for="name">이름 <span class="required">*</span></label>
  <input id="name" />
</form>`,
    highlightLines: [5],
    solutionCode: `<form class="checkout">
  <style>
    .required { color: #ef4444; font-weight: 700; }
    .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  </style>
  <label for="name">
    이름 <span class="required" aria-hidden="true">*</span>
    <span class="sr-only">(필수)</span>
  </label>
  <input id="name" />
</form>`,
  },
] as const

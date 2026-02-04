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
    kwcagCode: '2.1.1',
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
    kwcagCode: '3.3.2',
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
    kwcagCode: '2.4.1',
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
    id: 'low-contrast-text',
    kwcagCode: '8',
    title: '텍스트 명도 대비 부족 (Low Contrast)',
    description:
      '텍스트와 배경 간의 명도 대비는 최소 4.5:1 이상이어야 합니다(WCAG AA 기준). 회색 텍스트와 흰 배경의 조합은 대비가 부족하여 저시력 사용자나 색각 이상 사용자가 읽기 어렵습니다. 색상 값을 조정하여 충분한 대비를 제공해주세요.\n\n**현재 대비:** 약 2.8:1 (부족)\n**목표 대비:** 4.5:1 이상',
    difficulty: 'medium',
    environment: 'html',
    initialCode: `<article className="notice">
  <h2>공지사항</h2>
  <p style="color: #999999; background-color: #FFFFFF;">
    정기 점검이 2024년 2월 10일 오전 2시부터 4시까지 진행됩니다.
  </p>
</article>`,
    highlightLines: [3],
    solutionCode: `<article className="notice">
  <h2>공지사항</h2>
  <p style="color: #595959; background-color: #FFFFFF;">
    정기 점검이 2024년 2월 10일 오전 2시부터 4시까지 진행됩니다.
  </p>
</article>`,
  },
  {
    id: 'heading-structure-skip',
    kwcagCode: '18',
    title: '헤딩 순서 오류 (Heading Structure)',
    description:
      '헤딩(h1~h6)은 논리적 순서를 따라야 합니다. h1 다음에 바로 h3를 사용하면 스크린 리더 사용자가 문서 구조를 이해하기 어렵습니다. h1 → h2 → h3 순서로 단계를 건너뛰지 않아야 합니다.',
    difficulty: 'easy',
    environment: 'html',
    initialCode: `<div className="blog-post">
  <h1>웹 접근성 가이드</h1>
  <h3>대체 텍스트란?</h3>
  <p>이미지의 의미를 텍스트로 전달하는 것입니다.</p>
  <h3>키보드 접근성이란?</h3>
  <p>마우스 없이도 모든 기능을 사용할 수 있어야 합니다.</p>
</div>`,
    highlightLines: [3, 5],
    solutionCode: `<div className="blog-post">
  <h1>웹 접근성 가이드</h1>
  <h2>대체 텍스트란?</h2>
  <p>이미지의 의미를 텍스트로 전달하는 것입니다.</p>
  <h2>키보드 접근성이란?</h2>
  <p>마우스 없이도 모든 기능을 사용할 수 있어야 합니다.</p>
</div>`,
  },
  {
    id: 'table-structure-missing-header',
    kwcagCode: '3',
    title: '표 구조 - 헤더 셀 누락 (Table Headers)',
    description:
      '표는 <th> 요소로 헤더 셀을 명시해야 하며, scope 속성으로 행/열을 구분해야 합니다. 스크린 리더가 셀의 의미를 이해하고 사용자에게 정확히 전달할 수 있도록 합니다.',
    difficulty: 'medium',
    environment: 'html',
    initialCode: `<table>
  <caption>2024년 분기별 매출 현황</caption>
  <tr>
    <td>분기</td>
    <td>매출액</td>
    <td>증감률</td>
  </tr>
  <tr>
    <td>1분기</td>
    <td>500만원</td>
    <td>+10%</td>
  </tr>
  <tr>
    <td>2분기</td>
    <td>550만원</td>
    <td>+15%</td>
  </tr>
</table>`,
    highlightLines: [3, 4, 5, 6],
    solutionCode: `<table>
  <caption>2024년 분기별 매출 현황</caption>
  <thead>
    <tr>
      <th scope="col">분기</th>
      <th scope="col">매출액</th>
      <th scope="col">증감률</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1분기</th>
      <td>500만원</td>
      <td>+10%</td>
    </tr>
    <tr>
      <th scope="row">2분기</th>
      <td>550만원</td>
      <td>+15%</td>
    </tr>
  </tbody>
</table>`,
  },
  {
    id: 'vague-link-text',
    kwcagCode: '19',
    title: '모호한 링크 텍스트 (Vague Link)',
    description:
      '링크 텍스트는 그 자체로 목적지나 기능을 이해할 수 있어야 합니다. "여기", "클릭", "더보기" 같은 모호한 텍스트는 스크린 리더 사용자가 링크 목록을 탐색할 때 맥락을 알 수 없습니다. 구체적인 텍스트나 aria-label로 명확히 표현해주세요.',
    difficulty: 'easy',
    environment: 'react',
    initialCode: `<article className="article-card">
  <h3>웹 접근성 최신 뉴스</h3>
  <p>2024년부터 적용되는 새로운 KWCAG 지침에 대해 알아봅니다.</p>
  <a href="/news/kwcag-2024">여기를 클릭하세요</a>
</article>`,
    highlightLines: [4],
    solutionCode: `<article className="article-card">
  <h3>웹 접근성 최신 뉴스</h3>
  <p>2024년부터 적용되는 새로운 KWCAG 지침에 대해 알아봅니다.</p>
  <a href="/news/kwcag-2024">KWCAG 2024 지침 자세히 보기</a>
</article>`,
  },
  {
    id: 'language-missing',
    kwcagCode: '25',
    title: '페이지 언어 속성 누락 (Language Attribute)',
    description:
      'HTML 문서는 lang 속성으로 주 언어를 명시해야 합니다. 스크린 리더가 올바른 발음과 억양으로 콘텐츠를 읽을 수 있도록 합니다. 한국어 콘텐츠는 lang="ko"를 사용해주세요.',
    difficulty: 'easy',
    environment: 'html',
    initialCode: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>접근성 가이드</title>
</head>
<body>
  <h1>웹 접근성이란?</h1>
  <p>모든 사람이 웹을 이용할 수 있도록 하는 것입니다.</p>
</body>
</html>`,
    highlightLines: [2],
    solutionCode: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>접근성 가이드</title>
</head>
<body>
  <h1>웹 접근성이란?</h1>
  <p>모든 사람이 웹을 이용할 수 있도록 하는 것입니다.</p>
</body>
</html>`,
  },
] as const

// AUTO-GENERATED from docs/kwcag-guidelines.utf8.csv
// Source: (user-provided) '웹 접근성 텍스트 gems.CSV' converted to UTF-8
// DO NOT EDIT MANUALLY: run scripts/convert-kwcag-csv.ps1 then scripts/generate-kwcag-guidelines.mjs

export interface Guideline {
  code: string; // e.g. "1"
  title: string;
  description: string;
  principle: 'perceivable' | 'operable' | 'understandable' | 'robust';
}

export const KWCAG_GUIDELINES: readonly Guideline[] = [
  {
    code: "1",
    title: "적절한 대체 텍스트 제공",
    description: "텍스트 아닌 콘텐츠는 그 의미나 용도를 인식할 수 있도록 대체 텍스트를 제공해야 한다.",
    principle: "perceivable",
  },
  {
    code: "2",
    title: "자막 제공",
    description: "멀티미디어 콘텐츠에는 자막, 대본 또는 수어를 제공해야 한다.",
    principle: "perceivable",
  },
  {
    code: "3",
    title: "표의 구성",
    description: "표는 이해하기 쉽게 구성해야 한다.",
    principle: "perceivable",
  },
  {
    code: "4",
    title: "콘텐츠의 선형구조",
    description: "콘텐츠는 논리적인 순서로 제공해야 한다.",
    principle: "perceivable",
  },
  {
    code: "5",
    title: "명확한 지시사항 제공",
    description: "지시사항은 모양, 크기, 위치, 방향, 색, 소리 등에 관계없이 인식될 수 있어야 한다.",
    principle: "perceivable",
  },
  {
    code: "6",
    title: "색에 무관한 콘텐츠 인식",
    description: "콘텐츠는 색에 관계없이 인식될 수 있어야 한다.",
    principle: "perceivable",
  },
  {
    code: "7",
    title: "자동 재생 금지",
    description: "자동으로 소리가 재생되지 않아야 한다.",
    principle: "perceivable",
  },
  {
    code: "8",
    title: "텍스트 콘텐츠의 명도 대비",
    description: "텍스트 콘텐츠와 배경 간의 명도 대비는 4.5 대 1 이상이어야 한다.",
    principle: "perceivable",
  },
  {
    code: "9",
    title: "콘텐츠 간의 구분",
    description: "이웃한 콘텐츠는 구분될 수 있어야 한다.",
    principle: "perceivable",
  },
  {
    code: "10",
    title: "키보드 사용 보장",
    description: "모든 기능은 키보드만으로도 사용할 수 있어야 한다.",
    principle: "operable",
  },
  {
    code: "11",
    title: "초점 이동과 표시",
    description: "키보드에 의한 초점은 논리적으로 이동해야 하며, 시각적으로 구별할 수 있어야 한다.",
    principle: "operable",
  },
  {
    code: "12",
    title: "조작 가능",
    description: "사용자 입력 및 콘트롤은 조작 가능하도록 제공되어야 한다.",
    principle: "operable",
  },
  {
    code: "13",
    title: "문자 단축키",
    description: "문자 단축키는 오동작으로 인한 오류를 방지하여야 한다.",
    principle: "operable",
  },
  {
    code: "14",
    title: "응답시간 조절",
    description: "시간제한이 있는 콘텐츠는 응답시간을 조절할 수 있어야 한다.",
    principle: "operable",
  },
  {
    code: "15",
    title: "정지 기능 제공",
    description: "자동으로 변경되는 콘텐츠는 움직임을 제어할 수 있어야 한다.",
    principle: "operable",
  },
  {
    code: "16",
    title: "깜빡임과 번쩍임 사용 제한",
    description: "초당 3~50회 주기로 깜빡이거나 번쩍이는 콘텐츠를 제공하지 않아야 한다.",
    principle: "operable",
  },
  {
    code: "17",
    title: "반복 영역 건너뛰기",
    description: "콘텐츠의 반복되는 영역은 건너뛸 수 있어야 한다.",
    principle: "operable",
  },
  {
    code: "18",
    title: "제목 제공",
    description: "페이지, 프레임, 콘텐츠 블록에는 적절한 제목을 제공해야 한다.",
    principle: "operable",
  },
  {
    code: "19",
    title: "적절한 링크 텍스트",
    description: "링크 텍스트는 용도나 목적을 이해할 수 있도록 제공해야 한다.",
    principle: "operable",
  },
  {
    code: "20",
    title: "고정된 참조 위치 정보",
    description: "전자출판문서 형식의 웹 페이지는 각 페이지로 이동할 수 있는 기능이 있어야 하고, 서식이나 플랫폼에 상관없이 참조 위치 정보를 일관되게 제공ㆍ유지해야 한다.",
    principle: "operable",
  },
  {
    code: "21",
    title: "단일 포인터 입력 지원",
    description: "다중 포인터 또는 경로기반 동작을 통한 입력은 단일 포인터 입력으로도 조작할 수 있어야 한다.",
    principle: "understandable",
  },
  {
    code: "22",
    title: "포인터 입력 취소",
    description: "단일 포인터 입력으로 실행되는 기능은 취소할 수 있어야 한다.",
    principle: "understandable",
  },
  {
    code: "23",
    title: "레이블과 네임",
    description: "텍스트 또는 텍스트 이미지가 포함된 레이블이 있는 사용자 인터페이스 구성요소는 네임에 시각적으로 표시되는 해당 텍스트를 포함해야 한다.",
    principle: "understandable",
  },
  {
    code: "24",
    title: "동작기반 작동",
    description: "동작기반으로 작동하는 기능은 사용자 인터페이스 구성요소로 조작할 수 있고, 동작기반 기능을 비활성화할 수 있어야 한다.",
    principle: "understandable",
  },
  {
    code: "25",
    title: "기본 언어 표시",
    description: "주로 사용하는 언어를 명시해야 한다.",
    principle: "understandable",
  },
  {
    code: "26",
    title: "사용자 요구에 따른 실행",
    description: "사용자가 의도하지 않은 기능(새 창, 초점에 의한 맥락 변화 등)은 실행되지 않아야 한다.",
    principle: "understandable",
  },
  {
    code: "27",
    title: "찾기 쉬운 도움 정보",
    description: "도움 정보가 제공되는 경우, 각 페이지에서 동일한 상대적인 순서로 접근할 수 있어야 한다.",
    principle: "understandable",
  },
  {
    code: "28",
    title: "오류 정정",
    description: "입력 오류를 정정할 수 있는 방법을 제공해야 한다.",
    principle: "understandable",
  },
  {
    code: "29",
    title: "레이블 제공",
    description: "사용자 입력에는 대응하는 레이블을 제공해야 한다.",
    principle: "understandable",
  },
  {
    code: "30",
    title: "접근 가능한 인증",
    description: "인증 과정은 인지 기능 테스트에만 의존해서는 안 된다.",
    principle: "understandable",
  },
  {
    code: "31",
    title: "반복 입력 정보",
    description: "반복되는 입력 정보는 자동 입력 또는 선택 입력할 수 있어야 한다.",
    principle: "understandable",
  },
  {
    code: "32",
    title: "마크업 오류 방지",
    description: "마크업 언어의 요소는 열고 닫음, 중첩 관계 및 속성 선언에 오류가 없어야 한다.",
    principle: "robust",
  },
  {
    code: "33",
    title: "웹 애플리케이션 접근성 준수",
    description: "콘텐츠에 포함된 웹 애플리케이션은 접근성이 있어야 한다.",
    principle: "robust",
  },
] as const;

export function getGuidelineByCode(code: string): Guideline | undefined {
  return KWCAG_GUIDELINES.find((g) => g.code === code);
}

export function getGuidelinesByPrinciple(principle: Guideline['principle']): Guideline[] {
  return KWCAG_GUIDELINES.filter((g) => g.principle === principle);
}

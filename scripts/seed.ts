/**
 * Supabase DB 초기화 시딩 스크립트
 * 
 * 실행 방법:
 *   npx tsx scripts/seed.ts
 * 
 * 또는 ts-node 사용:
 *   npx ts-node scripts/seed.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// .env.local 파일 로드
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.')
  console.error('필요한 변수: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (또는 NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

// 서비스 키로 클라이언트 생성 (관리자 권한)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ============================================================================
// Guideline 데이터
// ============================================================================

const guidelines = [
  {
    code: '1.1.1',
    title: '적절한 대체 텍스트 제공',
    description: '텍스트 아닌 콘텐츠는 그 의미나 용도를 인식할 수 있도록 대체 텍스트를 제공해야 한다.',
    principle: 'perceivable' as const,
    level: 'A' as const,
  },
  {
    code: '2.1.1',
    title: '키보드 사용 보장',
    description: '모든 기능은 키보드만으로도 사용할 수 있어야 한다.',
    principle: 'operable' as const,
    level: 'A' as const,
  },
  {
    code: '2.4.2',
    title: '제목 제공',
    description: '페이지, 프레임, 콘텐츠 블록에는 적절한 제목을 제공해야 한다.',
    principle: 'operable' as const,
    level: 'A' as const,
  },
  {
    code: '3.3.2',
    title: '레이블 제공',
    description: '사용자 입력에는 대응하는 레이블을 제공해야 한다.',
    principle: 'understandable' as const,
    level: 'A' as const,
  },
  {
    code: '1.4.3',
    title: '텍스트 콘텐츠의 명도 대비',
    description: '텍스트와 배경 간의 명도 대비는 4.5:1 이상이어야 한다. (큰 텍스트는 3:1 이상)',
    principle: 'perceivable' as const,
    level: 'AA' as const,
  },
]

// ============================================================================
// Challenge 데이터
// ============================================================================

const challenges = [
  {
    id: 'challenge-1-1-1-alt-text',
    title: '이미지 대체 텍스트 누락',
    description:
      '의미를 가진 이미지에는 대체 텍스트(alt)가 필요합니다. alt가 없거나 비어 있으면 스크린 리더 사용자는 이미지의 의미를 알 수 없습니다.',
    guidelineCode: '1.1.1',
    difficulty: 'easy' as const,
    hint: '이미지의 의미를 설명하는 alt 속성이 필요합니다.',
    initialCode: `<img src="/logo.png">`,
    solutionCode: `<img src="/logo.png" alt="회사 로고">`,
    validationRule: {
      type: 'regex' as const,
      pattern: String.raw`<img\b[^>]*\balt\s*=\s*"(?!\s*")[^"]+"\b[^>]*>`,
      flags: 'gmi',
      shouldMatch: true,
      message: 'img 요소에 비어있지 않은 alt 속성이 필요합니다. 예: <img ... alt="설명">',
    },
  },
  {
    id: 'challenge-2-1-1-keyboard',
    title: '키보드 접근 불가 클릭 요소',
    description:
      '클릭 가능한 요소는 키보드로도 접근/작동 가능해야 합니다. div/span에 onClick만 있으면 기본적으로 포커스가 가지 않습니다.',
    guidelineCode: '2.1.1',
    difficulty: 'medium' as const,
    hint: 'div 요소는 기본적으로 포커스를 받을 수 없습니다. role과 tabIndex, 키보드 이벤트를 고려하세요.',
    initialCode: `<div onClick={() => alert("클릭됨")}>구독하기</div>`,
    solutionCode: `<div
  role="button"
  tabIndex={0}
  onClick={() => alert("클릭됨")}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      alert("클릭됨")
    }
  }}
>
  구독하기
</div>`,
    validationRule: {
      type: 'regex' as const,
      pattern: String.raw`<div\b[^>]*\brole\s*=\s*"(?:button)"[^>]*\btabIndex\s*=\s*(?:\{0\}|"0")[^>]*>`,
      flags: 'gmi',
      shouldMatch: true,
      message: '클릭 가능한 div에는 role="button"과 tabIndex={0}(또는 "0")를 제공해 키보드 포커스가 가능해야 합니다.',
    },
  },
  {
    id: 'challenge-2-4-2-page-title',
    title: '페이지 제목 부족',
    description:
      '페이지의 제목(`<title>`)이 "문서"라고만 되어 있어 내용을 알 수 없습니다. 구체적인 제목을 제공해야 스크린 리더 사용자와 브라우저 탭에서 페이지를 구분할 수 있습니다.',
    guidelineCode: '2.4.2',
    difficulty: 'easy' as const,
    hint: 'title 태그에 페이지의 목적이나 내용을 설명하는 구체적인 텍스트를 제공하세요.',
    initialCode: `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <title>문서</title>
  </head>
  <body>
    <h1>회원가입</h1>
    <form>
      <input type="text" placeholder="이름">
      <button type="submit">가입하기</button>
    </form>
  </body>
</html>`,
    solutionCode: `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <title>회원가입 - 접근성 배움터</title>
  </head>
  <body>
    <h1>회원가입</h1>
    <form>
      <input type="text" placeholder="이름">
      <button type="submit">가입하기</button>
    </form>
  </body>
</html>`,
    validationRule: {
      type: 'regex' as const,
      pattern: String.raw`<title>.*[가-힣a-zA-Z0-9\s\-]{3,}.*</title>`,
      flags: 'gmi',
      shouldMatch: true,
      message: 'title 태그에는 "문서"가 아닌 구체적인 페이지 제목이 필요합니다. 예: <title>회원가입 - 접근성 배움터</title>',
    },
  },
  {
    id: 'challenge-3-3-2-form-label',
    title: '폼 레이블 누락',
    description:
      '입력 필드에는 레이블이 있어야 합니다. label(for/id) 연결 또는 aria-label/aria-labelledby/title 등을 통해 스크린 리더가 용도를 알 수 있어야 합니다.',
    guidelineCode: '3.3.2',
    difficulty: 'easy' as const,
    hint: '스크린 리더 사용자가 입력 필드의 용도를 알 수 없습니다. label 연결 또는 aria-label 등을 제공하세요.',
    initialCode: `<input type="email" placeholder="Email">`,
    solutionCode: `<label htmlFor="email">이메일</label>
<input id="email" type="email" autoComplete="email" />`,
    validationRule: {
      type: 'regex' as const,
      pattern: String.raw`<label\b[^>]*\b(?:htmlFor|for)\s*=\s*"[^"]+"[^>]*>.*?</label>[\s\S]*?<input\b[^>]*\bid\s*=\s*"[^"]+"`,
      flags: 'gmi',
      shouldMatch: true,
      message: 'input에는 연결된 label이 필요합니다. 예: <label htmlFor="email">...</label> + <input id="email" ... />',
    },
  },
  {
    id: 'challenge-1-4-3-contrast',
    title: '텍스트 명도 대비 부족',
    description:
      '텍스트와 배경 간의 명도 대비가 4.5:1 미만입니다. 저시력 사용자가 텍스트를 읽기 어려울 수 있습니다.',
    guidelineCode: '1.4.3',
    difficulty: 'medium' as const,
    hint: '텍스트 색상과 배경 색상의 대비 비율을 4.5:1 이상으로 조정하세요. 예: 검은색 텍스트(#000) + 흰색 배경(#fff) = 21:1',
    initialCode: `<div style="color: #999; background-color: #fff;">
  <p>이 텍스트는 배경과 대비가 부족합니다.</p>
</div>`,
    solutionCode: `<div style="color: #000; background-color: #fff;">
  <p>이 텍스트는 배경과 충분한 대비를 가집니다.</p>
</div>`,
    validationRule: {
      type: 'regex' as const,
      // 색상 값이 너무 밝은 회색(#999, #aaa 등)이 아닌지 간단히 체크
      // 실제로는 더 정교한 대비 계산이 필요하지만, 학습용으로는 이 정도로 충분
      pattern: String.raw`color\s*:\s*(?:#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))\s*;`,
      flags: 'gmi',
      shouldMatch: true,
      message: '텍스트 색상이 명시되어 있는지 확인하세요. 대비 비율은 4.5:1 이상이어야 합니다.',
    },
  },
]

// ============================================================================
// 시딩 실행
// ============================================================================

async function seed() {
  console.log('🌱 Supabase DB 시딩 시작...\n')

  try {
    // 1. Guidelines 삽입
    console.log('📋 Guidelines 삽입 중...')
    const { data: guidelineData, error: guidelineError } = await supabase
      .from('guidelines')
      .upsert(guidelines, { onConflict: 'code' })
      .select()

    if (guidelineError) {
      throw new Error(`Guidelines 삽입 실패: ${guidelineError.message}`)
    }

    console.log(`✅ ${guidelineData?.length || 0}개의 Guideline 삽입 완료\n`)

    // 2. Challenges 삽입
    console.log('🎯 Challenges 삽입 중...')
    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .upsert(challenges, { onConflict: 'id' })
      .select()

    if (challengeError) {
      throw new Error(`Challenges 삽입 실패: ${challengeError.message}`)
    }

    console.log(`✅ ${challengeData?.length || 0}개의 Challenge 삽입 완료\n`)

    console.log('🎉 시딩 완료!')
    console.log('\n삽입된 데이터:')
    console.log(`- Guidelines: ${guidelineData?.length || 0}개`)
    console.log(`- Challenges: ${challengeData?.length || 0}개`)
  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:')
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// 실행
seed()


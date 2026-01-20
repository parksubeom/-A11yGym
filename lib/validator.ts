export interface ValidationResult {
  success: boolean
  message: string
}

/**
 * 챌린지별 검증을 위한 타입
 */
export type ChallengeId =
  | 'informative-image-banner'
  | 'decorative-image-icon'
  | 'complex-image-chart'
  | 'keyboard-clickable-div'
  | 'form-label-missing'
  | 'skip-link-missing'

/**
 * 문자열에서 JSX 속성 형태를 HTML 속성 형태로 어느 정도 정규화합니다.
 * - tabIndex={0} -> tabindex="0"
 * - tabIndex="0" -> tabindex="0"
 * - htmlFor="x" -> for="x"
 *
 * 주의: 완전한 파서가 아니며, "학습용/가벼운 검증"을 위한 최소 정규화입니다.
 */
function normalizeCode(code: string): string {
  return (
    code
      // React htmlFor -> for (label 매칭을 쉽게)
      .replace(/\bhtmlFor\s*=\s*"/g, 'for="')
      // tabIndex={0} / tabIndex="0" / tabIndex='0' -> tabindex="0"
      .replace(/\btabIndex\s*=\s*\{\s*0\s*\}/g, 'tabindex="0"')
      .replace(/\btabIndex\s*=\s*"0"/g, 'tabindex="0"')
      .replace(/\btabIndex\s*=\s*'0'/g, 'tabindex="0"')
      // role={"button"} 같은 형태를 role="button"으로 단순화
      .replace(/\brole\s*=\s*\{\s*"button"\s*\}/g, 'role="button"')
      .replace(/\brole\s*=\s*\{\s*'button'\s*\}/g, 'role="button"')
  )
}

/**
 * 1) validateAltText(code)
 * - <img> 태그에 alt 속성이 존재하는지
 * - alt 값이 비어있지 않은지
 *
 * 허용 예:
 * - <img alt="설명" ...>
 * - <img ... alt="설명">
 *
 * 실패 예:
 * - <img src="...">
 * - <img alt="">
 * - <img alt="   ">
 */
export function validateAltText(code: string): ValidationResult {
  const normalized = normalizeCode(code)

  const imgTags = normalized.match(/<img\b[^>]*>/gim) ?? []
  if (imgTags.length === 0) {
    return {
      success: false,
      message: '<img> 태그를 찾을 수 없습니다. 이미지가 있다면 <img> 요소를 포함해 주세요.',
    }
  }

  // alt="..." 가 존재하고, 공백만이 아닌 값
  const altOk = (tag: string) => /\balt\s*=\s*"(?!\s*")[^"]+"/i.test(tag)

  const failed = imgTags.filter((t) => !altOk(t))
  if (failed.length > 0) {
    return {
      success: false,
      message:
        '이미지에는 비어있지 않은 alt 속성이 필요합니다. 예: <img src=\"...\" alt=\"설명\" />',
    }
  }

  return { success: true, message: 'alt 속성 검증 통과: 모든 <img>에 적절한 alt가 있습니다.' }
}

/**
 * 2) validateLabel(code)
 * - <input>에 id가 있고
 * - 대응하는 <label for="...">가 존재하는지 확인
 *
 * 허용 예:
 * - <label for="email">이메일</label> ... <input id="email" ...>
 * - <label htmlFor="email">이메일</label> ... <input id="email" ...> (정규화로 처리)
 */
export function validateLabel(code: string): ValidationResult {
  const normalized = normalizeCode(code)

  const inputs = normalized.match(/<input\b[^>]*>/gim) ?? []
  if (inputs.length === 0) {
    return {
      success: false,
      message: '<input> 요소를 찾을 수 없습니다. 입력 요소가 있다면 <input>을 포함해 주세요.',
    }
  }

  // id="..." 추출
  const ids = inputs
    .map((tag) => {
      const m = tag.match(/\bid\s*=\s*"([^"]+)"/i)
      return m?.[1]?.trim()
    })
    .filter((v): v is string => Boolean(v))

  if (ids.length === 0) {
    return {
      success: false,
      message:
        '<input>에 id가 필요합니다. 예: <input id="email" ... /> (label과 연결하기 위함)',
    }
  }

  // label for="id" 존재 확인 (여러 input이 있을 수 있어 하나라도 통과가 아닌 "모든 id에 label"로 판단)
  const missing = ids.filter((id) => {
    const re = new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*"${escapeRegExp(id)}"[^>]*>`, 'i')
    return !re.test(normalized)
  })

  if (missing.length > 0) {
    return {
      success: false,
      message: `입력 필드에는 연결된 레이블이 필요합니다. 누락된 for/id: ${missing
        .map((x) => `"${x}"`)
        .join(', ')}`,
    }
  }

  return {
    success: true,
    message: '레이블 검증 통과: input id와 연결된 label(for)이 존재합니다.',
  }
}

/**
 * 3) validateKeyboard(code)
 * - onClick이 있는 비대화형 요소(div/span)에
 *   role="button"과 tabIndex="0"이 있는지 확인
 *
 * 허용 예:
 * - <div role="button" tabIndex={0} onClick={...}>...</div>
 * - <span role="button" tabindex="0" onClick={...}>...</span>
 */
export function validateKeyboard(code: string): ValidationResult {
  const normalized = normalizeCode(code)

  const candidates = normalized.match(/<(div|span)\b[^>]*>/gim) ?? []
  const clickable = candidates.filter((tag) => /\bonClick\s*=/.test(tag))

  if (clickable.length === 0) {
    return {
      success: false,
      message:
        'onClick이 있는 div/span 요소를 찾을 수 없습니다. 키보드 접근성 검증 대상이 필요합니다.',
    }
  }

  const missing = clickable.filter((tag) => {
    const hasRoleButton = /\brole\s*=\s*"button"/i.test(tag)
    const hasTabIndex0 = /\btabindex\s*=\s*"0"/i.test(tag)
    return !(hasRoleButton && hasTabIndex0)
  })

  if (missing.length > 0) {
    return {
      success: false,
      message:
        '클릭 가능한 div/span에는 role="button"과 tabIndex="0"(또는 tabIndex={0})이 필요합니다.',
    }
  }

  return {
    success: true,
    message: '키보드 접근성 검증 통과: 클릭 가능한 비대화형 요소에 role/tabIndex가 있습니다.',
  }
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 코드에서 img 태그를 추출하고 alt 속성 값을 반환
 */
function extractImgAltValues(code: string): Array<{ tag: string; alt: string | null }> {
  const normalized = normalizeCode(code)
  const imgTags = normalized.match(/<img\b[^>]*>/gim) ?? []

  return imgTags.map((tag) => {
    // alt="..." 또는 alt='...' 추출
    const altMatch = tag.match(/\balt\s*=\s*["']([^"']*)["']/i)
    const alt = altMatch ? altMatch[1] : null
    return { tag, alt }
  })
}

/**
 * 챌린지별 맞춤 검증 함수
 * 
 * @param challengeId - 챌린지 ID
 * @param userCode - 사용자가 작성한 코드
 * @returns 검증 결과
 */
export function validateChallenge(
  challengeId: ChallengeId,
  userCode: string
): ValidationResult {
  switch (challengeId) {
    case 'informative-image-banner':
      return validateInformativeImage(userCode)
    case 'decorative-image-icon':
      return validateDecorativeImage(userCode)
    case 'complex-image-chart':
      return validateComplexImage(userCode)
    case 'keyboard-clickable-div':
      return validateKeyboard(userCode)
    case 'form-label-missing':
      return validateLabel(userCode)
    case 'skip-link-missing':
      return validateSkipLink(userCode)
    default:
      return {
        success: false,
        message: `알 수 없는 챌린지 ID: ${challengeId}`,
      }
  }
}

function validateSkipLink(code: string): ValidationResult {
  const normalized = normalizeCode(code)

  // 본문 바로가기 링크 존재 여부
  const hasSkipLink = /<a\b[^>]*\bhref\s*=\s*"#content"[^>]*>/i.test(normalized)
  if (!hasSkipLink) {
    return {
      success: false,
      message:
        '본문 바로가기 링크가 필요합니다. 예: <a href="#content">본문 바로가기</a>',
    }
  }

  // 목적지(main#content) 존재 여부
  const hasContent = /<main\b[^>]*\bid\s*=\s*"content"[^>]*>/i.test(normalized)
  if (!hasContent) {
    return {
      success: false,
      message: '본문 영역에 id="content"가 필요합니다. 예: <main id="content">...</main>',
    }
  }

  return {
    success: true,
    message: '정답입니다! ✅ 반복 영역을 건너뛸 수 있는 링크가 제공되었습니다.',
  }
}

/**
 * Case 1: 정보성 이미지 검증
 * - img 태그에 alt 속성이 있어야 함
 * - alt 값이 비어있지 않아야 함
 * - alt에 핵심 키워드("봄", "50%", "할인")가 포함되어야 함 (유연한 매칭)
 */
function validateInformativeImage(code: string): ValidationResult {
  const images = extractImgAltValues(code)

  if (images.length === 0) {
    return {
      success: false,
      message: '이미지 태그를 찾을 수 없습니다. <img> 요소를 포함해 주세요.',
    }
  }

  // 첫 번째 이미지 검증 (일반적으로 하나의 이미지만 있을 것으로 예상)
  const firstImg = images[0]

  if (firstImg.alt === null) {
    return {
      success: false,
      message: '이미지에 alt 속성이 없습니다. 정보성 이미지는 대체 텍스트가 필요합니다.',
    }
  }

  if (firstImg.alt.trim() === '') {
    return {
      success: false,
      message: 'alt 속성이 비어있습니다. 이미지의 의미를 설명하는 텍스트를 입력하세요.',
    }
  }

  // 키워드 검증: 이미지에 실제로 보이는 텍스트만 정확히 전달해야 함
  // 이미지에 보이는 텍스트: "Spring Sale 50% OFF"
  const altLower = firstImg.alt.toLowerCase()
  const altText = firstImg.alt
  
  // 필수 키워드: "spring", "sale", "50%", "off" (이미지에 실제로 보이는 텍스트)
  const hasSpring = altLower.includes('spring')
  const hasSale = altLower.includes('sale')
  const hasPercent = /\d+%/.test(altText) || altLower.includes('50%')
  const hasOff = altLower.includes('off')

  // 모든 필수 키워드가 포함되어야 함 (이미지에 보이는 텍스트를 정확히 전달)
  const missingKeywords: string[] = []
  if (!hasSpring) missingKeywords.push('"Spring"')
  if (!hasSale) missingKeywords.push('"Sale"')
  if (!hasPercent) missingKeywords.push('"50%"')
  if (!hasOff) missingKeywords.push('"OFF"')

  if (missingKeywords.length > 0) {
    return {
      success: false,
      message: `alt 속성에는 이미지에 실제로 보이는 텍스트만 정확히 전달해야 합니다. 누락된 키워드: ${missingKeywords.join(', ')}. 이미지에는 "Spring Sale 50% OFF"가 표시되어 있습니다.`,
    }
  }

  // alt 텍스트가 너무 짧으면 경고 (선택적)
  if (firstImg.alt.trim().length < 10) {
    return {
      success: false,
      message: 'alt 텍스트가 너무 짧습니다. 이미지가 전달하는 정보를 더 구체적으로 설명해 주세요.',
    }
  }

  return {
    success: true,
    message: '정답입니다! ✅ 이미지에 적절한 대체 텍스트가 제공되었습니다.',
  }
}

/**
 * Case 2: 장식용 이미지 검증
 * - img 태그의 alt가 빈 문자열("")이어야 함
 */
function validateDecorativeImage(code: string): ValidationResult {
  const images = extractImgAltValues(code)

  if (images.length === 0) {
    return {
      success: false,
      message: '이미지 태그를 찾을 수 없습니다. <img> 요소를 포함해 주세요.',
    }
  }

  const firstImg = images[0]

  if (firstImg.alt === null) {
    return {
      success: false,
      message: '이미지에 alt 속성이 없습니다. 장식용 이미지는 alt=""로 설정해야 합니다.',
    }
  }

  // alt가 빈 문자열인지 확인 (공백만 있어도 실패)
  if (firstImg.alt.trim() !== '') {
    return {
      success: false,
      message:
        '장식용 이미지는 alt=""로 설정해야 합니다. 버튼에 이미 텍스트("설정")가 있으므로 중복 낭독을 방지해야 합니다.',
    }
  }

  return {
    success: true,
    message: '정답입니다! ✅ 장식용 이미지는 alt=""로 설정하여 중복 낭독을 방지합니다.',
  }
}

/**
 * Case 3: 복잡한 이미지 검증
 * - alt 속성에 구체적인 정보(수치, 연도 등)가 포함되어야 함
 * - 또는 aria-describedby가 연결되어 있어야 함
 */
function validateComplexImage(code: string): ValidationResult {
  const images = extractImgAltValues(code)
  const normalized = normalizeCode(code)

  if (images.length === 0) {
    return {
      success: false,
      message: '이미지 태그를 찾을 수 없습니다. <img> 요소를 포함해 주세요.',
    }
  }

  const firstImg = images[0]

  if (firstImg.alt === null) {
    return {
      success: false,
      message: '이미지에 alt 속성이 없습니다. 복잡한 이미지는 구체적인 설명이 필요합니다.',
    }
  }

  if (firstImg.alt.trim() === '') {
    return {
      success: false,
      message: 'alt 속성이 비어있습니다. 차트의 구체적인 수치와 정보를 포함해야 합니다.',
    }
  }

  // aria-describedby 확인
  const hasAriaDescribedBy = /aria-describedby\s*=\s*["']([^"']+)["']/i.test(normalized)

  // alt에 구체적인 정보가 포함되어 있는지 확인
  // 수치 키워드("년", "억", "원")가 포함되어야 함
  const altText = firstImg.alt
  const hasYear = /\d{4}년/.test(altText) || (/\d{4}/.test(altText) && altText.includes('년'))
  const hasAmount = /억/.test(altText) || /원/.test(altText) || /\d+억/.test(altText) || /\d+원/.test(altText)
  const hasSpecificData = altText.includes('매출') || altText.includes('그래프') || altText.includes('막대') || altText.includes('연도')

  // 단순한 "차트"만 있는 경우 실패
  if (altText.trim().toLowerCase() === '차트' || altText.trim().toLowerCase() === 'chart') {
    return {
      success: false,
      message: 'alt 텍스트가 너무 단순합니다. "차트"가 아닌 구체적인 수치와 정보를 포함해야 합니다.',
    }
  }

  // 수치 키워드 검증: "년", "억", "원" 중 하나 이상 포함되어야 함
  const missingNumericKeywords: string[] = []
  if (!hasYear && !altText.match(/\d{4}/)) {
    missingNumericKeywords.push('연도 정보 (예: "2020년" 또는 "2020")')
  }
  if (!hasAmount) {
    missingNumericKeywords.push('금액 정보 (예: "억", "원")')
  }

  // aria-describedby가 있으면 수치 키워드 요구사항 완화
  if (hasAriaDescribedBy) {
    // aria-describedby가 있으면 alt는 간단해도 되지만, 여전히 구체적인 정보가 있으면 더 좋음
    if (hasSpecificData || altText.trim().length >= 15) {
      return {
        success: true,
        message: '정답입니다! ✅ 복잡한 이미지에 aria-describedby가 연결되어 있고, alt에도 구체적인 정보가 포함되었습니다.',
      }
    }
    // aria-describedby만 있고 alt가 너무 짧으면 경고
    if (altText.trim().length < 10) {
      return {
        success: false,
        message: 'aria-describedby가 연결되어 있지만, alt 텍스트도 최소한의 설명을 포함해야 합니다.',
      }
    }
    return {
      success: true,
      message: '정답입니다! ✅ 복잡한 이미지에 aria-describedby가 연결되어 있습니다.',
    }
  }

  // aria-describedby가 없으면 수치 키워드가 반드시 포함되어야 함
  if (missingNumericKeywords.length > 0) {
    return {
      success: false,
      message: `복잡한 이미지는 구체적인 수치 정보가 필요합니다. 누락된 정보: ${missingNumericKeywords.join(', ')}. 예: "2020년 1억원, 2021년 1.5억원..."`,
    }
  }

  // alt 텍스트가 충분히 길어야 함 (최소 20자 이상)
  if (altText.trim().length < 20) {
    return {
      success: false,
      message: 'alt 텍스트가 너무 짧습니다. 복잡한 이미지는 더 구체적인 설명(최소 20자 이상)이 필요합니다.',
    }
  }

  return {
    success: true,
    message: '정답입니다! ✅ 복잡한 이미지에 구체적인 수치와 정보가 포함되었습니다.',
  }
}



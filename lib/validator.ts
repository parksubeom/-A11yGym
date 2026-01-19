export interface ValidationResult {
  success: boolean
  message: string
}

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



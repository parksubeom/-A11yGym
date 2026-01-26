/**
 * KWCAG 가이드라인 헬퍼 함수
 * 
 * 내부 체크리스트 ID를 기반으로 한글 제목, WCAG 코드 등을 가져옵니다.
 */

import { getGuidelineByCode } from '@/constants/kwcag-guidelines'
import { getWcagCodeFromChecklistId } from '@/constants/kwcag-mapping'

export interface GuidelineInfo {
  /** 내부 체크리스트 ID (예: "29") */
  checklistId: string
  /** 한글 제목 (예: "레이블 제공") */
  title: string
  /** 설명 */
  description: string
  /** WCAG 코드 (예: "3.3.2") */
  wcagCode: string | null
  /** 원칙 */
  principle: 'perceivable' | 'operable' | 'understandable' | 'robust'
}

/**
 * 체크리스트 ID로 가이드라인 정보 가져오기
 * 
 * @param checklistId 내부 체크리스트 ID (예: "29")
 * @returns 가이드라인 정보 또는 null
 */
export function getGuidelineInfo(checklistId: string): GuidelineInfo | null {
  const guideline = getGuidelineByCode(checklistId)
  if (!guideline) return null

  const wcagCode = getWcagCodeFromChecklistId(checklistId)

  return {
    checklistId,
    title: guideline.title,
    description: guideline.description,
    wcagCode,
    principle: guideline.principle,
  }
}

/**
 * 가이드라인 표시용 텍스트 생성
 * 
 * @param checklistId 내부 체크리스트 ID
 * @param options 표시 옵션
 * @returns 표시용 텍스트 (예: "29. 레이블 제공" 또는 "레이블 제공 (3.3.2)")
 */
export function formatGuidelineDisplay(
  checklistId: string,
  options: {
    showId?: boolean
    showWcagCode?: boolean
    format?: 'full' | 'title-only' | 'code-only'
  } = {}
): string {
  const info = getGuidelineInfo(checklistId)
  if (!info) return checklistId

  const { showId = true, showWcagCode = true, format } = options

  if (format === 'title-only') {
    return info.title
  }

  if (format === 'code-only') {
    return info.wcagCode || checklistId
  }

  // 기본: full format
  const parts: string[] = []
  
  if (showId) {
    parts.push(`${info.checklistId}.`)
  }
  
  parts.push(info.title)
  
  if (showWcagCode && info.wcagCode) {
    parts.push(`(${info.wcagCode})`)
  }

  return parts.join(' ')
}

/**
 * WCAG 코드로 체크리스트 ID 찾기 (역방향 검색)
 * 
 * @param wcagCode WCAG 코드 (예: "3.3.2")
 * @returns 체크리스트 ID 배열 (여러 개일 수 있음)
 */
export function findChecklistIdsByWcagCode(wcagCode: string): string[] {
  const ids: string[] = []
  
  // 1부터 33까지 모든 ID 확인
  for (let i = 1; i <= 33; i++) {
    const id = i.toString()
    const mappedWcagCode = getWcagCodeFromChecklistId(id)
    if (mappedWcagCode === wcagCode) {
      ids.push(id)
    }
  }
  
  return ids
}


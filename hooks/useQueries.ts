'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Guideline } from '@/constants/kwcag-guidelines'
import type { Challenge } from '@/types/challenge'
import { getWcagCodeFromChecklistId } from '@/constants/kwcag-mapping'

// ============================================================================
// 타입 정의
// ============================================================================

export interface ChallengeDetail extends Challenge {
  id: string
  createdAt?: string
  updatedAt?: string
}

/**
 * UI 노출용 Guideline 타입
 * - `code`: UI에 보여줄 표준 코드(가능하면 WCAG/KWCAG 성공기준 코드)
 * - `internalCode`: 내부 CSV 기반 체크리스트 id(1~33)
 */
export type GuidelineView = Guideline & {
  internalCode: string
  code: string
  wcagCode: string | null
}

export interface UserProgress {
  id: string
  userId: string
  challengeId: string
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  submittedAt?: string
  completedAt?: string
  attempts: number
  lastSubmittedCode?: string
}

export interface SubmitSolutionParams {
  challengeId: string
  userId: string
  code: string
  isValid: boolean
}

export interface SubmitSolutionResponse {
  success: boolean
  message: string
  progress?: UserProgress
}

// ============================================================================
// Query Keys
// ============================================================================

export const queryKeys = {
  guidelines: ['guidelines'] as const,
  challenge: (id: string) => ['challenge', id] as const,
  userProgress: (userId: string) => ['userProgress', userId] as const,
} as const

// ============================================================================
// Hooks
// ============================================================================

/**
 * 전체 지침 목록 조회
 * 캐싱 적용: staleTime 5분
 */
export function useGuidelines() {
  return useQuery<GuidelineView[], Error>({
    queryKey: queryKeys.guidelines,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guidelines')
        .select('*')
        .order('code', { ascending: true })

      if (error) {
        throw new Error(`지침 목록 조회 실패: ${error.message}`)
      }

      const rows = ((data as Guideline[]) || []).map((g) => {
        const wcagCode = getWcagCodeFromChecklistId(g.code)
        return {
          ...g,
          internalCode: g.code,
          wcagCode,
          // UI 기본 표시는 표준 코드 우선(없으면 기존 id 유지)
          code: wcagCode ?? g.code,
        }
      })

      // UI 정렬: 표준 코드가 있으면 표준 코드 기준, 없으면 내부 id 숫자 기준
      rows.sort((a, b) => {
        const aKey = a.wcagCode ?? a.internalCode
        const bKey = b.wcagCode ?? b.internalCode

        // "1.1.1" 형태는 문자열 비교가 부정확할 수 있으니 숫자 토큰 비교
        const parse = (v: string) => v.split('.').map((x) => Number(x))
        const aParts = parse(aKey)
        const bParts = parse(bKey)
        const len = Math.max(aParts.length, bParts.length)
        for (let i = 0; i < len; i++) {
          const av = aParts[i] ?? 0
          const bv = bParts[i] ?? 0
          if (av !== bv) return av - bv
        }
        return 0
      })

      return rows
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
  })
}

/**
 * 특정 챌린지 상세 조회
 */
export function useChallenge(id: string | null) {
  return useQuery<ChallengeDetail | null, Error>({
    queryKey: queryKeys.challenge(id || ''),
    queryFn: async () => {
      if (!id) return null

      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null
        }
        throw new Error(`챌린지 조회 실패: ${error.message}`)
      }

      return data as ChallengeDetail
    },
    enabled: Boolean(id), // id가 있을 때만 실행
    staleTime: 2 * 60 * 1000, // 2분
  })
}

/**
 * 사용자의 챌린지 풀이 현황 조회
 */
export function useUserProgress(userId: string | null) {
  return useQuery<UserProgress[], Error>({
    queryKey: queryKeys.userProgress(userId || ''),
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('userId', userId)
        .order('updatedAt', { ascending: false })

      if (error) {
        throw new Error(`진행 상황 조회 실패: ${error.message}`)
      }

      return (data as UserProgress[]) || []
    },
    enabled: Boolean(userId), // userId가 있을 때만 실행
    staleTime: 30 * 1000, // 30초
  })
}

/**
 * 정답 제출 및 결과 저장 (Mutation)
 */
export function useSubmitSolution() {
  const queryClient = useQueryClient()

  return useMutation<SubmitSolutionResponse, Error, SubmitSolutionParams>({
    mutationFn: async (params) => {
      const { challengeId, userId, code, isValid } = params

      // 1. 기존 진행 상황 조회
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('userId', userId)
        .eq('challengeId', challengeId)
        .single()

      const status: UserProgress['status'] = isValid
        ? 'completed'
        : existingProgress?.status === 'completed'
          ? 'completed'
          : 'failed'

      const progressData: Partial<UserProgress> = {
        userId,
        challengeId,
        status,
        lastSubmittedCode: code,
        attempts: (existingProgress?.attempts || 0) + 1,
        submittedAt: new Date().toISOString(),
        ...(isValid && { completedAt: new Date().toISOString() }),
      }

      // 2. 진행 상황 저장 또는 업데이트
      let result
      if (existingProgress) {
        const { data, error } = await supabase
          .from('user_progress')
          .update(progressData)
          .eq('id', existingProgress.id)
          .select()
          .single()

        if (error) {
          throw new Error(`진행 상황 업데이트 실패: ${error.message}`)
        }
        result = data
      } else {
        const { data, error } = await supabase
          .from('user_progress')
          .insert(progressData)
          .select()
          .single()

        if (error) {
          throw new Error(`진행 상황 저장 실패: ${error.message}`)
        }
        result = data
      }

      return {
        success: isValid,
        message: isValid
          ? '정답입니다! 챌린지를 완료했습니다.'
          : '오답입니다. 다시 시도해보세요.',
        progress: result as UserProgress,
      }
    },
    onSuccess: (data, variables) => {
      // 진행 상황 쿼리 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({
        queryKey: queryKeys.userProgress(variables.userId),
      })
    },
  })
}


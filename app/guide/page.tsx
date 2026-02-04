'use client'

import Link from 'next/link'
import { Home, BookOpen, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KWCAG_GUIDELINES } from '@/constants/kwcag-guidelines'
import { getWcagCodeFromChecklistId } from '@/constants/kwcag-mapping'
import { formatGuidelineDisplay } from '@/utils/guideline-helper'
import { getGuidelineDetail, getRelatedChallenges } from '@/utils/guideline-details'

const principleLabels = {
  perceivable: '인식의 용이성',
  operable: '운용의 용이성',
  understandable: '이해의 용이성',
  robust: '견고성',
}

const principleColors = {
  perceivable: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
  operable: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200',
  understandable: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200',
  robust: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200',
}

export default function GuidePage() {
  const guidelinesByPrinciple = {
    perceivable: KWCAG_GUIDELINES.filter((g) => g.principle === 'perceivable'),
    operable: KWCAG_GUIDELINES.filter((g) => g.principle === 'operable'),
    understandable: KWCAG_GUIDELINES.filter((g) => g.principle === 'understandable'),
    robust: KWCAG_GUIDELINES.filter((g) => g.principle === 'robust'),
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5" />
            A11yGym
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-slate-50 to-white pt-16 pb-12 dark:from-slate-950 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <Badge variant="outline" className="px-3 py-1 rounded-full border-primary/20 text-primary bg-primary/5">
              <BookOpen className="h-3 w-3 mr-1" />
              KWCAG 2.2 가이드라인
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              웹 접근성 가이드라인
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
              한국형 웹 콘텐츠 접근성 지침(KWCAG) 2.2 기준의 모든 가이드라인을 확인하고 학습하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Guidelines by Principle */}
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          {Object.entries(guidelinesByPrinciple).map(([principle, guidelines]) => (
            <div key={principle} className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className={`border ${principleColors[principle as keyof typeof principleColors]}`} variant="secondary">
                  {principleLabels[principle as keyof typeof principleLabels]}
                </Badge>
                <h2 className="text-2xl font-bold">
                  {principleLabels[principle as keyof typeof principleLabels]}
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({guidelines.length}개 지침)
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {guidelines.map((guideline) => {
                  const wcagCode = getWcagCodeFromChecklistId(guideline.code)
                  const detail = getGuidelineDetail(guideline.code)
                  const relatedChallenges = getRelatedChallenges(guideline.code)
                  
                  return (
                    <Card key={guideline.code} className="hover:shadow-md transition-shadow flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {guideline.code}
                          </Badge>
                          {wcagCode && (
                            <Badge variant="outline" className="font-mono text-xs text-primary">
                              {wcagCode}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          {guideline.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-3">
                        <CardDescription className="text-sm leading-relaxed">
                          {guideline.description}
                        </CardDescription>
                        
                        {detail.keyPoints && detail.keyPoints.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t">
                            <p className="text-xs font-medium text-foreground">주요 포인트:</p>
                            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                              {detail.keyPoints.map((point, idx) => (
                                <li key={idx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {detail.example && (
                          <div className="space-y-1.5 pt-2 border-t">
                            <p className="text-xs font-medium text-foreground">예시:</p>
                            <pre className="text-xs bg-muted px-2 py-1.5 rounded block overflow-x-auto font-mono">
                              <code>{detail.example}</code>
                            </pre>
                          </div>
                        )}
                        
                        {relatedChallenges.length > 0 && (
                          <div className="space-y-1.5 pt-2 border-t">
                            <p className="text-xs font-medium text-foreground">관련 챌린지:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {relatedChallenges.map((challenge) => (
                                <Link
                                  key={challenge.id}
                                  href={`/challenges/${challenge.id}`}
                                  className="text-xs text-primary hover:underline"
                                >
                                  {challenge.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="border-t bg-slate-50/50 dark:bg-slate-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-2xl font-bold">실전 연습 시작하기</h2>
            <p className="text-muted-foreground">
              가이드라인을 읽는 것만으로는 부족합니다. 실제 코드를 수정하며 접근성을 익혀보세요.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/">챌린지 시작하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <CardTitle>KWCAG 2.2란?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">KWCAG 2.2 (한국형 웹 콘텐츠 접근성 지침)</strong>는
                웹 접근성을 위한 한국 표준 가이드라인입니다. WCAG 2.2를 기반으로 하되,
                한국의 웹 환경과 사용자 특성을 반영하여 구성되었습니다.
              </p>
              <div className="space-y-2">
                <p className="text-foreground font-medium">4가지 원칙 (POUR):</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>인식의 용이성 (Perceivable)</strong>: 정보와 UI 구성요소는 사용자가 인식할 수 있어야 함</li>
                  <li><strong>운용의 용이성 (Operable)</strong>: UI 구성요소와 탐색은 운용 가능해야 함</li>
                  <li><strong>이해의 용이성 (Understandable)</strong>: 정보와 UI 운용은 이해할 수 있어야 함</li>
                  <li><strong>견고성 (Robust)</strong>: 콘텐츠는 보조 기술을 포함한 넓은 범위의 사용자 에이전트에 의존하여 해석될 수 있어야 함</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}


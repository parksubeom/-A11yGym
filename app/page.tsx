import Link from 'next/link'
import { SAMPLE_CHALLENGES } from '@/constants/sample-challenges'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { formatGuidelineDisplay } from '@/utils/guideline-helper'

const difficultyColors = {
  easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
  hard: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200',
}

const difficultyLabels = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section: 그라데이션 및 현대적인 타이포그래피 적용 */}
      <section className="relative border-b bg-gradient-to-b from-slate-50 to-white pt-24 pb-20 dark:from-slate-950 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-6 animate-fade-up">
            <Badge variant="outline" className="px-3 py-1 rounded-full border-primary/20 text-primary bg-primary/5 mb-4">
              v1.0 Beta · Web Accessibility Training
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl break-keep">
              웹 접근성, <span className="text-primary">실전 코드</span>로<br className="hidden sm:block" /> 확실하게 익히세요.
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto break-keep leading-relaxed">
              이론만으로는 부족합니다. 잘못된 코드를 직접 수정하고, 
              실시간 피드백을 받으며 &apos;접근성 근육&apos;을 키워보세요.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" className="h-12 px-8 text-base font-medium shadow-lg shadow-primary/20">
                <Link href="/guide">가이드 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Grid Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">추천 챌린지</h2>
            <p className="text-muted-foreground mt-1">
              가장 빈번하게 발생하는 웹 접근성 이슈들을 모았습니다.
            </p>
          </div>
          <Button variant="ghost" className="text-primary gap-1">
            전체 보기 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {SAMPLE_CHALLENGES.map((challenge, index) => (
            <Card
              key={challenge.id}
              className="flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 dark:border-slate-800"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge
                    className={`border ${difficultyColors[challenge.difficulty]}`}
                    variant="secondary"
                  >
                    {difficultyLabels[challenge.difficulty]}
                  </Badge>
                  {/* 완료 상태 표시 예시 (나중에 실제 데이터 연동) */}
                  {/* <CheckCircle2 className="h-5 w-5 text-green-500" /> */}
                </div>
                <CardTitle className="text-xl font-bold leading-tight line-clamp-2">
                  {challenge.title}
                </CardTitle>
                <CardDescription className="font-mono text-xs text-primary/80 bg-primary/5 inline-block px-2 py-1 rounded mt-2">
                  {formatGuidelineDisplay(challenge.kwcagCode, { showId: true, showWcagCode: true })}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {challenge.description}
                </p>
              </CardContent>
              
              <CardFooter className="pt-4 border-t bg-slate-50/50 dark:bg-slate-900/50">
                <Button asChild className="w-full group">
                  <Link href={`/challenges/${challenge.id}`}>
                    도전하기
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
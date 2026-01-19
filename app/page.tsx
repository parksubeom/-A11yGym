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

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const difficultyLabels = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              A11y Training Platform
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              접근성 근육을 키우는 gym을 뜻하는 웹 접근성 연습 플랫폼
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              KWCAG 2.2 기준의 실습 챌린지를 통해 웹 접근성을 배워보세요
            </p>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">챌린지 목록</h2>
          <p className="mt-2 text-muted-foreground">
            아래 챌린지를 선택하여 접근성 문제를 해결해보세요
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_CHALLENGES.map((challenge) => (
            <Card
              key={challenge.id}
              className="flex flex-col transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <Badge
                    className={difficultyColors[challenge.difficulty]}
                    variant="secondary"
                  >
                    {difficultyLabels[challenge.difficulty]}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  가이드라인: {challenge.guidelineCode}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {challenge.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/challenges/${challenge.id}`}>챌린지 시작하기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}


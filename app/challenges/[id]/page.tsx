'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Home } from 'lucide-react'

import { CodeEditor } from '@/components/CodeEditor'
import { HintPanel, type HintLevel } from '@/components/HintPanel'
import { generateHintForChallenge } from '@/utils/generate-hints'
import { PreviewPanel } from '@/components/PreviewPanel'
import { SAMPLE_CHALLENGES } from '@/constants/sample-challenges'
import type { Challenge } from '@/types/challenge'
import { useAppStore } from '@/store/useAppStore'
import { validateChallenge } from '@/lib/validator'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function findLocalChallenge(id: string): Challenge | null {
  const found = SAMPLE_CHALLENGES.find((c) => c.id === id)
  return found ?? null
}

/**
 * 사용자 코드를 챌린지별 검증 로직으로 검증
 * 
 * validateChallenge 함수를 사용하여 챌린지별 맞춤 검증을 수행합니다.
 */
function validateSolution(challenge: Challenge, code: string) {
  // 챌린지 ID가 validateChallenge에서 지원하는 타입인지 확인
  const supportedIds = [
    'informative-image-banner',
    'decorative-image-icon',
    'complex-image-chart',
    'keyboard-clickable-div',
    'form-label-missing',
    'skip-link-missing',
  ]
  
  if (supportedIds.includes(challenge.id)) {
    const result = validateChallenge(
      challenge.id as
        | 'informative-image-banner'
        | 'decorative-image-icon'
        | 'complex-image-chart'
        | 'keyboard-clickable-div'
        | 'form-label-missing'
        | 'skip-link-missing',
      code
    )
    return {
      ok: result.success,
      message: result.message,
    }
  }

  // 지원하지 않는 챌린지의 경우 기본 검증
  return {
    ok: false,
    message: '이 챌린지는 아직 검증 로직이 구현되지 않았습니다.',
  }
}

export default function ChallengePage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const {
    userCode,
    setUserCode,
    testResult,
    setTestResult,
    isCodeRunning,
    setIsCodeRunning,
  } = useAppStore()

  const [previewCode, setPreviewCode] = useState<string>('') // 실행 시점 기준 코드
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [resultMessage, setResultMessage] = useState<string>('')

  const challenge = useMemo(() => (id ? findLocalChallenge(id) : null), [id])

  // 챌린지 변경 시 코드 초기화
  useEffect(() => {
    if (!challenge) return

    // 새로고침 시에도 초기화되어야 하므로, 항상 initialCode로 시작
    setUserCode(challenge.initialCode)
    setPreviewCode(challenge.initialCode)

    // 챌린지 변경 시 testResult 초기화
    setTestResult({ status: 'idle' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.id])

  const guideMarkdown = useMemo(() => {
    if (!challenge) return ''
    return `## ${challenge.title}

**가이드라인:** \`${challenge.kwcagCode}\`

${challenge.description}
`
  }, [challenge])

  const hints: HintLevel[] = useMemo(() => {
    if (!challenge) return []
    // 2단계 힌트 시스템: 1=문제 분석, 2=정답 코드 전체
    // (기본 가이드는 가이드라인 섹션에서 이미 제공되므로 제거)

    // CSV 기반 구체적인 힌트 생성
    const hint1 = generateHintForChallenge(challenge)

    return [
      {
        level: 1,
        title: '문제 분석',
        content: hint1,
      },
      {
        level: 2,
        title: '정답 코드',
        content: challenge.solutionCode,
      },
    ]
  }, [challenge])

  const handleRun = () => {
    setIsCodeRunning(true)
    setPreviewCode(userCode)
    // UX: 아주 짧게 러닝 상태 표시
    window.setTimeout(() => setIsCodeRunning(false), 150)
  }

  const handleSubmit = () => {
    if (!challenge) return
    const { ok, message } = validateSolution(challenge, userCode)

    setTestResult({
      status: ok ? 'success' : 'failure',
      message,
    })

    setResultMessage(message)
    setIsResultOpen(true)
  }

  if (!id) {
    return <div className="p-6">잘못된 접근입니다.</div>
  }

  if (!challenge) {
    return <div className="p-6">챌린지를 찾을 수 없습니다: {id}</div>
  }

  return (
    <div className="h-[calc(100vh-0px)]">
      {/* 상단 액션 바 */}
      <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" aria-label="홈으로 돌아가기">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">{challenge.title}</h1>
            <p className="text-sm text-muted-foreground">가이드라인: {challenge.kwcagCode}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" onClick={handleRun} disabled={isCodeRunning}>
            {isCodeRunning ? '실행 중…' : '코드 실행'}
          </Button>
          <Button onClick={handleSubmit}>제출</Button>
        </div>
      </div>

      {/* 모바일: 탭 전환 / 데스크톱: 리사이즈 패널 */}
      <div className="h-[calc(100vh-56px)]">
        {/* Mobile */}
        <div className="block h-full md:hidden">
          <Tabs defaultValue="editor" className="h-full">
            <div className="border-b px-4 py-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guide">가이드</TabsTrigger>
                <TabsTrigger value="editor">에디터</TabsTrigger>
                <TabsTrigger value="preview">미리보기</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="guide" className="h-[calc(100%-56px)] overflow-auto p-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideMarkdown}</ReactMarkdown>
              <div className="mt-6">
                <HintPanel hints={hints} />
              </div>
            </TabsContent>

            <TabsContent value="editor" className="h-[calc(100%-56px)] overflow-hidden p-4 flex flex-col">
              <div className="flex-1 min-h-0 min-w-0">
                <CodeEditor
                  code={userCode}
                  onChange={setUserCode}
                  readOnly={false}
                  language="html"
                  highlightLines={(challenge as { highlightLines?: number[] })?.highlightLines}
                  className="h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="h-[calc(100%-56px)] overflow-auto p-4">
              <Tabs defaultValue="render">
                <TabsList>
                  <TabsTrigger value="render">Preview</TabsTrigger>
                  <TabsTrigger value="result">Result</TabsTrigger>
                </TabsList>
                <TabsContent value="render" className="mt-3">
                  <PreviewPanel
                    code={previewCode}
                    assets={challenge.assets}
                  />
                </TabsContent>
                  <TabsContent value="result" className="mt-3">
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">테스트 결과</div>
                      <div className="mt-2 text-sm">
                        {testResult.status === 'idle'
                          ? '아직 결과가 없습니다. 코드를 제출해주세요.'
                          : testResult.status === 'success'
                            ? `✅ ${testResult.message}`
                            : `❌ ${testResult.message}`}
                      </div>
                    </div>
                  </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop */}
        <div className="hidden h-full md:block">
          <ResizablePanelGroup orientation="horizontal" className="h-full">
            {/* Left: Guide */}
            <ResizablePanel defaultSize={28} minSize={18}>
              <div className="h-full overflow-auto p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideMarkdown}</ReactMarkdown>
                <div className="mt-6">
                  <HintPanel hints={hints} />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Center: Editor */}
            <ResizablePanel defaultSize={44} minSize={26}>
              <div className="h-full overflow-hidden p-4 flex flex-col min-w-0">
                <div className="flex-1 min-h-0 min-w-0">
                  <CodeEditor
                    code={userCode}
                    onChange={setUserCode}
                    readOnly={false}
                    language="html"
                    ariaLabel="챌린지 코드 편집기"
                    highlightLines={(challenge as { highlightLines?: number[] })?.highlightLines}
                    className="h-full"
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right: Preview + Result Tabs */}
            <ResizablePanel defaultSize={28} minSize={20}>
              <div className="h-full overflow-auto p-4">
                <Tabs defaultValue="render">
                  <TabsList>
                    <TabsTrigger value="render">Preview</TabsTrigger>
                    <TabsTrigger value="result">Result</TabsTrigger>
                  </TabsList>

                  <TabsContent value="render" className="mt-3">
                    <PreviewPanel
                      code={previewCode}
                      assets={challenge.assets}
                    />
                  </TabsContent>

                  <TabsContent value="result" className="mt-3">
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">테스트 결과</div>
                      <div className="mt-2 text-sm">
                        {testResult.status === 'idle'
                          ? '아직 결과가 없습니다. 코드를 제출해주세요.'
                          : testResult.status === 'success'
                            ? `✅ ${testResult.message}`
                            : `❌ ${testResult.message}`}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* 제출 결과 모달 */}
      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>제출 결과</DialogTitle>
            <DialogDescription>
              {testResult.status === 'success'
                ? '축하합니다! 조건을 만족했습니다.'
                : '조건을 만족하지 못했습니다. 힌트를 확인해보세요.'}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border bg-muted p-3 text-sm">{resultMessage}</div>

          <DialogFooter>
            <Button onClick={() => setIsResultOpen(false)}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



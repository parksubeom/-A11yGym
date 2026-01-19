'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { CodeEditor } from '@/components/CodeEditor'
import { HintPanel, type HintLevel } from '@/components/HintPanel'
import { PreviewPanel } from '@/components/PreviewPanel'
import { SAMPLE_CHALLENGES, type Challenge } from '@/constants/sample-challenges'
import { useAppStore } from '@/store/useAppStore'

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

function validateSolution(challenge: Challenge, code: string) {
  const rule = challenge.validationRule
  if (rule.type === 'regex') {
    const re = new RegExp(rule.pattern, rule.flags ?? 'gms')
    const shouldMatch = rule.shouldMatch ?? true
    const matched = re.test(code)
    const ok = shouldMatch ? matched : !matched
    return {
      ok,
      message: ok ? '정답입니다! ✅' : rule.message,
    }
  }

  return { ok: false, message: '지원하지 않는 검증 규칙입니다.' }
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

  // 최초 진입 시 기본 코드 세팅 (persist된 userCode가 비어있을 때만)
  useEffect(() => {
    if (!challenge) return
    if (userCode.trim().length === 0) {
      setUserCode(challenge.initialCode)
      setPreviewCode(challenge.initialCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.id])

  const guideMarkdown = useMemo(() => {
    if (!challenge) return ''
    return `## ${challenge.title}

**가이드라인:** \`${challenge.guidelineCode}\`

${challenge.description}

---

### 힌트
${challenge.hint}
`
  }, [challenge])

  const hints: HintLevel[] = useMemo(() => {
    if (!challenge) return []
    // 3단계 힌트 시스템: (예시) 1=가이드, 2=검증룰 메시지, 3=정답 일부
    const solutionSnippet =
      challenge.solutionCode.length > 160
        ? `${challenge.solutionCode.slice(0, 160)}...`
        : challenge.solutionCode

    return [
      {
        level: 1,
        title: '기본 가이드',
        content: challenge.hint,
      },
      {
        level: 2,
        title: '검증 기준 힌트',
        content: challenge.validationRule.message,
      },
      {
        level: 3,
        title: '정답 코드 일부',
        content: solutionSnippet,
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
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{challenge.title}</h1>
          <p className="text-sm text-muted-foreground">가이드라인: {challenge.guidelineCode}</p>
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

            <TabsContent value="editor" className="h-[calc(100%-56px)] overflow-auto p-4">
              <CodeEditor code={userCode} onChange={setUserCode} readOnly={false} language="html" />
            </TabsContent>

            <TabsContent value="preview" className="h-[calc(100%-56px)] overflow-auto p-4">
              <Tabs defaultValue="render">
                <TabsList>
                  <TabsTrigger value="render">Preview</TabsTrigger>
                  <TabsTrigger value="result">Result</TabsTrigger>
                </TabsList>
                <TabsContent value="render" className="mt-3">
                  <PreviewPanel code={previewCode} />
                </TabsContent>
                <TabsContent value="result" className="mt-3">
                  <div className="rounded-md border p-4">
                    <div className="text-sm text-muted-foreground">테스트 결과</div>
                    <div className="mt-2 text-sm">{testResult.message ?? '아직 결과가 없습니다.'}</div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop */}
        <div className="hidden h-full md:block">
          <ResizablePanelGroup direction="horizontal" className="h-full">
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
              <div className="h-full overflow-auto p-4">
                <CodeEditor
                  code={userCode}
                  onChange={setUserCode}
                  readOnly={false}
                  language="html"
                  ariaLabel="챌린지 코드 편집기"
                />
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
                    <PreviewPanel code={previewCode} />
                  </TabsContent>

                  <TabsContent value="result" className="mt-3">
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">테스트 결과</div>
                      <div className="mt-2 text-sm">{testResult.message ?? '아직 결과가 없습니다.'}</div>
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



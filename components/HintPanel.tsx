'use client'

import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface HintLevel {
  level: 1 | 2 | 3
  title: string
  content: string
}

export interface HintPanelProps {
  hints: HintLevel[]
  className?: string
}

/**
 * 3단계 힌트 시스템을 제공하는 패널
 * - 아코디언 UI로 단계별 힌트 표시
 * - 스크린 리더가 새로운 힌트를 즉시 읽을 수 있도록 aria-live 적용
 */
export function HintPanel({ hints, className }: HintPanelProps) {
  const [openedLevels, setOpenedLevels] = useState<Set<number>>(new Set())

  const handleValueChange = (value: string | string[]) => {
    const values = Array.isArray(value) ? value : [value]
    const levels = values
      .map((v) => {
        const match = v.match(/hint-(\d)/)
        return match ? parseInt(match[1], 10) : null
      })
      .filter((l): l is number => l !== null)
    setOpenedLevels(new Set(levels))
  }

  // 정렬된 힌트 (레벨 순서대로)
  const sortedHints = [...hints].sort((a, b) => a.level - b.level)

  return (
    <div className={className}>
      <div className="rounded-md border bg-background">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">힌트</h2>
        </div>

        <Accordion
          type="multiple"
          onValueChange={handleValueChange}
          className="w-full"
          defaultValue={[]}
        >
          {sortedHints.map((hint) => (
            <HintAccordionItem
              key={hint.level}
              hint={hint}
              isOpen={openedLevels.has(hint.level)}
            />
          ))}
        </Accordion>
      </div>
    </div>
  )
}

interface HintAccordionItemProps {
  hint: HintLevel
  isOpen: boolean
}

function HintAccordionItem({ hint, isOpen }: HintAccordionItemProps) {
  return (
    <AccordionItem value={`hint-${hint.level}`}>
      <AccordionTrigger className="px-4">
        <span className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {hint.level}
          </span>
          <span>{hint.title}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4">
        <div
          aria-live="polite"
          aria-atomic="true"
          role="region"
          aria-label={`${hint.level}단계 힌트`}
        >
          {isOpen && (
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {hint.level === 3 ? (
                // 정답 코드는 코드 블록으로 표시
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                  <code>{hint.content}</code>
                </pre>
              ) : (
                <p>{hint.content}</p>
              )}
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}


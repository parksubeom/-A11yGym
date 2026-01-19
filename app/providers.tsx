'use client'

import { QueryProvider } from '@/hooks/use-query'

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}


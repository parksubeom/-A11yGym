import { create } from 'zustand'

interface AppState {
  // 상태 타입 정의
}

export const useAppStore = create<AppState>()((set) => ({
  // 초기 상태 및 액션들
}))


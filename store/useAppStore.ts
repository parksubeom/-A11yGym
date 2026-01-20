import { create } from "zustand"

export type EditorTab = "editor" | "preview"

export type TestResult =
  | { status: "idle"; message?: string }
  | { status: "success"; message: string }
  | { status: "failure"; message: string }

export interface AppUser {
  id: string
  email?: string
  name?: string
}

export interface ChallengeRef {
  id: string
  title: string
  guidelineCode?: string
}

export interface AppState {
  // User
  currentUser: AppUser | null
  isAuthenticated: boolean

  // Challenge
  currentChallenge: ChallengeRef | null
  userCode: string
  isCodeRunning: boolean

  // UI
  isSidebarOpen: boolean
  currentTab: EditorTab

  // Feedback
  showHint: boolean
  hintLevel: 1 | 2 | 3
  testResult: TestResult

  // Actions: User
  setCurrentUser: (user: AppUser | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  logout: () => void

  // Actions: Challenge
  setCurrentChallenge: (challenge: ChallengeRef | null) => void
  setUserCode: (code: string) => void
  setIsCodeRunning: (isRunning: boolean) => void
  resetChallengeSession: () => void

  // Actions: UI
  toggleSidebar: () => void
  setSidebarOpen: (isOpen: boolean) => void
  setCurrentTab: (tab: EditorTab) => void

  // Actions: Feedback
  setShowHint: (show: boolean) => void
  setHintLevel: (level: 1 | 2 | 3) => void
  setTestResult: (result: TestResult) => void
  resetFeedback: () => void
}

const initialState = {
  // User
  currentUser: null,
  isAuthenticated: false,

  // Challenge
  currentChallenge: null,
  userCode: "",
  isCodeRunning: false,

  // UI
  isSidebarOpen: true,
  currentTab: "editor" as const,

  // Feedback
  showHint: false,
  hintLevel: 1 as const,
  testResult: { status: "idle" } as const,
} satisfies Omit<
  AppState,
  | "setCurrentUser"
  | "setIsAuthenticated"
  | "logout"
  | "setCurrentChallenge"
  | "setUserCode"
  | "setIsCodeRunning"
  | "resetChallengeSession"
  | "toggleSidebar"
  | "setSidebarOpen"
  | "setCurrentTab"
  | "setShowHint"
  | "setHintLevel"
  | "setTestResult"
  | "resetFeedback"
>

/**
 * 전역 앱 스토어
 *
 * NOTE:
 * - 사용자 요청에 따라 새로고침 시 에디터 코드는 초기화되어야 하므로,
 *   `userCode`는 localStorage에 persist하지 않습니다.
 */
export const useAppStore = create<AppState>()((set) => ({
  ...initialState,

  // User
  setCurrentUser: (user) =>
    set(() => ({
      currentUser: user,
      isAuthenticated: Boolean(user),
    })),
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  logout: () =>
    set(() => ({
      currentUser: null,
      isAuthenticated: false,
    })),

  // Challenge
  setCurrentChallenge: (challenge) => set(() => ({ currentChallenge: challenge })),
  setUserCode: (code) => set(() => ({ userCode: code })),
  setIsCodeRunning: (isRunning) => set(() => ({ isCodeRunning: isRunning })),
  resetChallengeSession: () =>
    set(() => ({
      currentChallenge: null,
      userCode: "",
      isCodeRunning: false,
    })),

  // UI
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set(() => ({ isSidebarOpen: isOpen })),
  setCurrentTab: (tab) => set(() => ({ currentTab: tab })),

  // Feedback
  setShowHint: (show) => set(() => ({ showHint: show })),
  setHintLevel: (level) => set(() => ({ hintLevel: level })),
  setTestResult: (result) => set(() => ({ testResult: result })),
  resetFeedback: () =>
    set(() => ({
      showHint: false,
      hintLevel: 1,
      testResult: { status: "idle" },
    })),
}))



import { createJSONStorage } from 'zustand/middleware'

/**
 * SSR 안전 스토리지.
 * 서버(window 없음)에서는 no-op 스토리지를 반환해 zustand persist가
 * localStorage에 접근하다 크래시하는 것을 방지한다. 클라이언트에서는
 * 평소대로 localStorage를 사용한다.
 */
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

export const safeStorage = createJSONStorage(() =>
  typeof window !== 'undefined' ? window.localStorage : (noopStorage as Storage),
)

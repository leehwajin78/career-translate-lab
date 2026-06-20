'use client'

import { useScrollRestoration } from '@/hooks/useScrollRestoration'

/** 경로 변경 시 스크롤 위치를 제어하는 비시각적 클라이언트 컴포넌트. */
export default function ScrollRestoration() {
  useScrollRestoration()
  return null
}

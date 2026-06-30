import { redirect } from 'next/navigation'

// 무료 진단은 /diagnosis 단일 페이지에서 결과(Report)까지 인페이지로 표시한다(System 1로 통일).
// 구버전 /result(System 2)는 제거되었으므로, 잔존 링크·북마크는 진단 시작점으로 영구 리다이렉트한다.
export default function ResultRedirect() {
  redirect('/diagnosis')
}

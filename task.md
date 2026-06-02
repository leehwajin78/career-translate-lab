# 나다운 브랜딩 42문항 AI 진단 및 코칭 워크스페이스 구현 태스크

## Phase A: 42문항 질문 및 응답 시스템 (완료)
- [x] `src/data/coachingQuestions.ts` — 42문항 데이터
- [x] `src/store/authStore.ts` — 로컬 인증 스토어
- [x] `src/store/coachingStore.ts` — 응답 저장 및 관리 스토어
- [x] `src/lib/audioRecorder.ts` — 음성 녹음 유틸
- [x] `src/components/coaching/TextInputMode.tsx` — 텍스트 작성 UI
- [x] `src/components/coaching/VoiceRecordMode.tsx` — 음성 녹음 UI
- [x] `src/pages/coaching/CoachingDashboard.tsx` — 대시보드
- [x] `src/pages/coaching/CoachingQuestions.tsx` — 42문항 마법사 UI
- [x] `src/pages/coaching/CoachingReview.tsx` — 제출 전 검토 화면
- [x] `src/pages/Admin.tsx` — 어드민 회원 관리 및 답변 조회 탭

## Phase B: AI 분석 상태 설계 및 Claude API 연동 (완료)
- [x] `src/store/coachingStore.ts` 상태 확장 (AI 초안, 최종 브랜드 프로필, 코치 메모, 상태 변경 추가)
- [x] `src/lib/coachingAI.ts` — Claude 3.5 Sonnet API 연동 및 로컬 Mock 분석기 구현
- [x] `src/pages/coaching/CoachingAnalyzing.tsx` — 제출 후 분석 진행 중 로딩 화면 구현

## Phase C: 코치용 1:1 워크스페이스 및 어드민 연동 (완료)
- [x] `src/pages/coaching/CoachingWorkspace.tsx` — 좌우 분할 코치용 워크스페이스 화면 구현
- [x] `src/pages/Admin.tsx` — "코칭 세션 시작" 버튼 추가 및 상태에 따른 워크스페이스 진입 제어

## Phase D: 최종 리포트 및 대시보드 연동 (완료)
- [x] `src/pages/coaching/CoachingReport.tsx` — 최종 확정된 브랜드 프로필 시각화 화면
- [x] `src/pages/coaching/CoachingDashboard.tsx` — 제출 완료 후 대기 화면 및 최종 확정 후 리포트 진입 제어 추가
- [x] `src/App.tsx` — 신규 라우트 연동 (`/coaching/analyzing`, `/coaching/report`, `/coaching/workspace/:memberId`)

## Phase E: 검증 (완료)
- [x] TypeScript 컴파일 및 빌드 검사 (`npm run build` 완벽 성공)
- [ ] 최종 사용자 시나리오 수동 테스트

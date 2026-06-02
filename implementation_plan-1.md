# 42문항 답변 완료 시 관리자 즉시 알림 시스템 설계

회원이 42문항 자가진단 및 AI 정밀 분석을 마치고 최종 제출을 완료하면, 운영자(관리자)에게 실시간으로 알림을 보내는 시스템을 구축합니다. 이를 통해 운영자는 대시보드를 수동으로 새로고침하지 않아도 즉시 코칭 대기 상태를 파악하고 1:1 코칭 세션 준비에 돌입할 수 있습니다.

---

## User Review Required

> [!IMPORTANT]
> **알림음(Chime) 사운드 생성**
> - 브라우저 자체 Web Audio API를 활용하여 외부 오디오 자원 로드 없이 즉석에서 맑고 청아한 신호음(C5 ➔ E5 톤)을 합성하여 재생합니다. 별도의 오디오 파일이 필요 없어 로딩 지연이 발생하지 않습니다.
>
> **데스크톱 푸시 알림 권한**
> - 관리자 화면(/admin) 진입 시 브라우저 알림 권한 허용을 요청하는 팝업이 노출됩니다. 권한 승인 시 관리자 페이지가 백그라운드에 있거나 다른 탭을 보고 있을 때도 OS 알림으로 실시간 통보됩니다.
>
> **Netlify Forms 통합 알림**
> - Netlify Forms에 `coaching-submissions` 양식을 제출하도록 설계하여, Netlify 대시보드 내에서 자체 Slack/이메일 알림 설정을 즉시 활성화할 수 있도록 연동합니다.

---

## Open Questions

> [!NOTE]
> 추가 질문이 있으시면 피드백란을 통해 알려주세요. 현재 설계는 로컬스토리지 동기화 및 탭 간 브로드캐스트를 모두 지원하여 동일 브라우저 내의 어느 탭에서든 즉시 반응합니다.

---

## Proposed Changes

### 1. 알림 상태 관리 및 브로드캐스트 시스템
- [NEW] [notificationStore.ts](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/store/notificationStore.ts)
  - Zustand 스토어로 알림 목록(`id`, `memberId`, `memberName`, `status`, `timestamp`, `isRead`) 관리.
  - LocalStorage persist 적용 (`kkummolda-notifications`).
  - 브라우저의 `BroadcastChannel('kkummolda_admin_notif')`을 사용하여 멀티 탭 간 실시간 이벤트 동기화 지원.
  - HTML5 Notification API를 사용한 데스크톱 알림 트리거 및 Web Audio API 기반 오디오 알림음 재생 기능 제공.

### 2. 코칭 최종 제출 시 알림 트리거
- [MODIFY] [CoachingAnalyzing.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/pages/coaching/CoachingAnalyzing.tsx)
  - AI 분석 완료 및 `submit(member.id)` 호출 시점에 `notificationStore`의 `triggerNotification`을 호출.
  - Netlify Forms에도 비동기로 알림 폼(`coaching-submissions`) 데이터를 전송하여 외부 이메일/Slack 웹훅 연동 지원.

### 3. 관리자 대시보드 알림 수신 및 UI 구성
- [MODIFY] [Admin.tsx](file:///e:/꿈몰다/외부사업/2026/모두의연구소/career-translate-lab/src/pages/Admin.tsx)
  - 우측 상단에 알림 센터(종 아이콘 배지 및 드롭다운 리스트) 추가.
  - 읽지 않은 알림 개수 배지 표시.
  - 알림 클릭 시 읽음 처리 및 해당 회원의 코칭 워크스페이스(`/coaching/workspace/:memberId`)로 즉시 이동.
  - 관리자 화면 첫 진입 시 브라우저 데스크톱 알림 권한 요청 및 안내.
  - 실시간 수신 시 화면 우측 하단에 인터랙티브 Toast 알림을 즉시 팝업.

---

## Verification Plan

### Automated Tests
- `tsc --noEmit` 실행하여 타입 유효성 검사.
- `npm run build` 실행하여 프로덕션 빌드 성공 여부 검증.

### Manual Verification
1. **멀티 탭 시나리오 테스트**:
   - 브라우저 창 A: 관리자 화면 `/admin` 접속.
   - 브라우저 창 B: 테스터 회원 계정 로그인 후 `/coaching/review`에서 최종 제출.
   - **기대 결과**: 창 A(관리자 화면)에서 즉시 알림음(딩동- chimes)이 들리며, 화면 우측 하단에 "테스터님이 42문항 답변 제출 완료!" Toast 알림이 노출되고, 알림 종 아이콘에 빨간 배지가 카운팅됨.
2. **알림 클릭 이동**:
   - 관리자 화면의 알림 드롭다운에서 알림 클릭 시 해당 회원의 코칭 워크스페이스로 매끄럽게 이동되는지 확인.
3. **데스크톱 푸시**:
   - 관리자 화면에서 브라우저 알림 권한 허용 후, 다른 탭으로 이동한 상태에서 제출을 수행했을 때 OS 데스크톱 푸시 알림이 발송되는지 확인.

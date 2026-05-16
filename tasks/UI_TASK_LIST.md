# UI 및 프론트엔드(FE) 태스크 목록

본 문서는 `TASK_LIST_v1_final.md`에서 UI(화면) 및 프론트엔드(FE) 상호작용과 관련된 태스크들만 추출하여 화면 및 기능 단위로 분류한 목록입니다.

## 1. 랜딩 페이지 및 진단 폼 (고객용 화면)
| Task ID | Epic | Feature (상세 내용) |
|---|---|---|
| **Q-001** | FE/Landing | 랜딩페이지 서비스 소개 및 진단 시작 CTA UI |
| **Q-002** | FE/Diagnose | 16문항 진단 폼 UI — 질문 카드, assetHint, textarea |
| **DPR-001** | DataProtection | 고객 동의 체크박스 UI (개인정보 수집·AI 처리 동의) |
| **FE-001** | FE/Diagnose | 진단 폼 클라이언트 유효성 검증 (이름, 연락처 1개+, 답변 3단어+) |
| **FE-002** | FE/Diagnose | 진단 폼 제출 (submitDiagnosis 연동) 및 완료/검수 대기 안내 화면 |
| **PERF-003** | Performance | AI 리포트 생성 60초 초과 시 "처리 중" 안내 UI 표시 |

## 2. 관리자 콘솔 (관리자용 화면)
| Task ID | Epic | Feature (상세 내용) |
|---|---|---|
| **Q-003** | FE/Admin | 관리자 진단 목록 조회 UI (`/admin`) |
| **Q-004** | FE/Admin | 관리자 진단 상세 조회 UI (`/admin/diagnoses/[id]`) |
| **FE-003** | FE/Admin | 관리자 리포트 수정 편집기 UI (reportJson 필드별) |
| **FE-004** | FE/Admin | 관리자 승인/거부/재생성 버튼 및 연동 (reviewReport/regenerateReport) |
| **FE-007** | FE/Admin | 관리자 인증 UI 흐름 제어 — 환경변수 패스워드 체크 및 접근 차단 |

## 3. 진단 리포트 웹뷰 (고객/관리자 공통 확인용)
| Task ID | Epic | Feature (상세 내용) |
|---|---|---|
| **Q-005** | FE/Report | 승인 리포트 웹뷰 UI (`/report/[id]`) |
| **FE-005** | FE/Report | 미승인 리포트 접근 시 404 / "준비 중" 표시 UI (접근 제어) |
| **FE-006** | FE/Report | 리포트 내 CTA 버튼 — 환경변수 기반 링크 연동 (구글폼/이메일/카카오 등) |

---
**요약:** 총 97개의 전체 태스크 중 위 **14건**이 순수 UI 제작 및 프론트엔드 사용자 인터랙션 처리(Validation, 로딩 상태, 라우팅 제어 등)에 해당합니다. 프론트엔드 작업 진행 시 위 태스크들을 우선적으로 그룹화하여 진행하시면 됩니다. 추가로 각 화면별 상세 이슈 문서(`ISSUE_FE-XXX.md` 및 `ISSUE_Q-XXX.md`)에 세부 스펙이 작성되어 있습니다.

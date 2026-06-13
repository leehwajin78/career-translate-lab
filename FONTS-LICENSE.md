# 사용 서체 라이선스 정보

이 프로젝트에서 사용하는 서체의 라이선스 조건을 정리합니다.

---

## SCDream (에스씨드림)

| 항목 | 내용 |
|---|---|
| **제작** | SC제일은행 (Standard Chartered Bank Korea) |
| **버전** | SCDream3 (Light 300), SCDream5 (Medium 500), SCDream8 (ExtraBold 800) |
| **파일 위치** | `src/assets/fonts/SCDream3.otf`, `SCDream5.otf`, `SCDream8.otf` |
| **로딩 방식** | `@font-face` self-hosting |

### 라이선스 조건 요약

SCDream은 SC제일은행이 배포한 **무료 공개 서체**입니다.

- ✅ **개인 사용** — 허용
- ✅ **상업적 사용** — 허용
- ✅ **웹사이트 임베딩 (self-hosting)** — 허용
- ✅ **인쇄물 사용** — 허용
- ⚠️ **서체 파일 재배포** — 단독 서체 파일 자체의 재판매·재배포는 금지
- ⚠️ **서체 수정** — 원본 서체 변형 후 재배포 금지
- ❌ **SC제일은행 브랜드 도용** — 서체를 이용한 SC제일은행 사칭 금지

> **원문 라이선스 확인:** https://www.scfont.co.kr/  
> (배포 페이지에서 "이용약관" 섹션 참조)

### 프로젝트 적용 현황

```css
/* src/index.css */
@font-face {
  font-family: 'SCDream';
  src: url('/src/assets/fonts/SCDream3.otf') format('opentype');
  font-weight: 300;
  font-display: swap;
}
@font-face {
  font-family: 'SCDream';
  src: url('/src/assets/fonts/SCDream5.otf') format('opentype');
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: 'SCDream';
  src: url('/src/assets/fonts/SCDream8.otf') format('opentype');
  font-weight: 800;
  font-display: swap;
}
```

### 대체 서체 (라이선스 이슈 발생 시)

| 대체 서체 | 출처 | 라이선스 | 특이사항 |
|---|---|---|---|
| **Pretendard** | GitHub (orioncactus/pretendard) | SIL OFL 1.1 (영구 무료·상업 허용) | 가장 유사한 형태·웨이트 |
| **Noto Sans KR** | Google Fonts | SIL OFL 1.1 | 범용 한글, Google CDN 사용 가능 |

---

## Lucide React (아이콘)

| 항목 | 내용 |
|---|---|
| **라이선스** | ISC License (MIT와 동등) |
| **상업적 사용** | ✅ 허용 |
| **버전** | package.json 참조 |

---

*최종 업데이트: 2026-06-13*

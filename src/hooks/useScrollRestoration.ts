import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 라우트 변경 시 스크롤 제어:
 * - hash(#process, #packages 등)가 있으면 해당 요소로 부드럽게 스크롤
 * - hash가 없으면 페이지 최상단으로 스크롤
 */
export function useScrollRestoration() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // hash가 있으면 해당 요소로 스크롤 (DOM 렌더 대기)
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // hash가 없으면 최상단으로
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [pathname, hash]);
}

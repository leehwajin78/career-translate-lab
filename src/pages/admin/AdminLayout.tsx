import { Link, Outlet, useLocation } from "react-router-dom";

const NAV = [
  {
    group: "이운 콘솔",
    items: [
      { to: "/admin", label: "관리자 콘솔 2탭", tag: "P1", exact: true },
      { to: "/admin/lead", label: "리드 상세", tag: "현행" },
      { to: "/admin/notifications", label: "알림 시스템", tag: "현행" },
      { to: "/admin/auth", label: "어드민 인증 게이트", tag: "P1" },
    ],
  },
  {
    group: "AI 엔진 (Phase 2)",
    items: [
      { to: "/admin/brief", label: "마스터 브리프", tag: "P2" },
      { to: "/admin/oneliner", label: "슬라이드 3종", tag: "P2" },
      { to: "/admin/questions", label: "질문 아키텍처", tag: "P2" },
      { to: "/admin/patterns", label: "패턴 분류기", tag: "P2" },
      { to: "/admin/mapper", label: "브랜딩 매퍼", tag: "P2" },
      { to: "/admin/feedback", label: "코칭 피드백", tag: "P2" },
      { to: "/admin/rules", label: "리포트 룰", tag: "P2" },
      { to: "/admin/crosscheck", label: "교차검증", tag: "P2" },
      { to: "/admin/handoff", label: "휴먼 트랜스퍼", tag: "P2" },
      { to: "/admin/airuns", label: "AI 호출 로그", tag: "P1" },
    ],
  },
  {
    group: "확장 (Phase 3)",
    items: [
      { to: "/admin/retainer", label: "리테이너 관리", tag: "P3" },
      { to: "/admin/export", label: "PPT Export", tag: "P3" },
    ],
  },
];

const tagCls = (tag: string) => {
  if (tag === "현행") return "bg-emerald-500/20 text-emerald-300";
  if (tag === "P1") return "bg-blue-500/20 text-blue-300";
  if (tag === "P2") return "bg-white/10 text-white/40";
  return "bg-white/5 text-white/30";
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <aside className="w-52 shrink-0 bg-[#0D1A3E] text-white flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <p className="font-bold text-sm leading-tight">한끗프로젝트</p>
          <p className="text-[10px] text-white/40 mt-0.5">ADMIN · career-translate-lab</p>
        </div>
        <nav className="flex-1 py-2">
          {NAV.map((sec) => (
            <div key={sec.group}>
              <p className="px-5 pt-4 pb-1 text-[9px] font-bold tracking-widest uppercase text-white/30">
                {sec.group}
              </p>
              {sec.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-5 py-2 text-[12px] transition-colors ${
                      active
                        ? "bg-white/15 text-white font-semibold"
                        : "text-white/55 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tagCls(item.tag)}`}>
                      {item.tag}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

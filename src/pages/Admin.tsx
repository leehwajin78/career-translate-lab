import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LEAD_STATUSES, useLeadsStore } from "@/store/leads";
import { PACKAGES, FREE_DIAGNOSTIC_QUESTIONS } from "@/data/content";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useCoachingStore } from "@/store/coachingStore";
import { COACHING_QUESTIONS, COACHING_PARTS } from "@/data/coachingQuestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Trash2, UserPlus, Key, User, Mail, ShieldAlert, Award, FileText, CheckCircle, Clock, Volume2, Shield, Bell, Check } from "lucide-react";
import {
  useNotificationStore,
  playChime,
  requestNotificationPermission,
} from "@/store/notificationStore";

// AdminGate placeholder — swap with real auth later
function AdminGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const PRODUCT_LABELS: Record<string, string> = {
  diagnosis: "한끗 진단 (50만원)",
  build: "한끗 빌드 (350만원)",
  launch: "한끗 론칭 (700만원)",
  partner: "한끗 파트너 (월 100만원)",
};

const getApplyCategory = (lead: any) => {
  const outcomes = lead.outcomes || [];
  const memo = lead.memo || "";
  
  if (outcomes.includes("한끗 파트너") || memo.includes("한끗 파트너") || memo.includes("apply-partner")) {
    return {
      label: "한끗 파트너",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    };
  }
  if (outcomes.includes("한끗 론칭") || memo.includes("한끗 론칭") || memo.includes("apply-launch")) {
    return {
      label: "한끗 론칭",
      className: "bg-rose-50 text-rose-700 border border-rose-200",
    };
  }
  if (outcomes.includes("한끗 빌드") || memo.includes("한끗 빌드") || memo.includes("apply-build")) {
    return {
      label: "한끗 빌드",
      className: "bg-amber-50 text-amber-700 border border-amber-200",
    };
  }
  if (
    outcomes.includes("한끗 진단") || 
    memo.includes("한끗 진단") || 
    memo.includes("정식 유료 진단") || 
    memo.includes("apply-diagnosis")
  ) {
    return {
      label: "한끗 진단",
      className: "bg-blue-50 text-blue-700 border border-blue-200",
    };
  }
  
  return {
    label: "무료상담",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
  };
};

// Helper to display relative time for notifications
const getRelativeTime = (isoString: string) => {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  return `${diffDays}일 전`;
};

export default function Admin() {
  const { leads, updateStatus, updateMemo } = useLeadsStore();
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 1. Request desktop push notification permission on mount
  useEffect(() => {
    requestNotificationPermission().then((granted) => {
      if (granted) {
        console.log("Desktop push notification permission granted.");
      }
    });
  }, []);

  // 2. Listen for custom event triggered by BroadcastChannel on submission from other tabs
  useEffect(() => {
    const handleNewSubmission = (event: Event) => {
      const customEvent = event as CustomEvent;
      const notification = customEvent.detail;
      if (!notification) return;

      // Play synthesized audio chime (C5 -> E5)
      playChime();

      // Show in-app Toast
      toast({
        title: "🔔 신규 답변 완료 알림",
        description: `${notification.memberName}님이 42문항 답변을 제출했습니다.`,
        action: (
          <button
            onClick={() => {
              markAsRead(notification.id);
              setShowNotifications(false);
              navigate(`/coaching/workspace/${notification.memberId}`);
            }}
            className="bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary/95 transition-all shrink-0"
          >
            워크스페이스 이동
          </button>
        ),
      });
    };

    window.addEventListener("kkummolda-new-submission", handleNewSubmission);
    return () => {
      window.removeEventListener("kkummolda-new-submission", handleNewSubmission);
    };
  }, [navigate, markAsRead]);

  const filteredLeads = leads.filter((l) => {
    if (categoryFilter === "all") return true;
    const cat = getApplyCategory(l);
    if (categoryFilter === "free") return cat.label === "무료상담";
    if (categoryFilter === "diagnosis") return cat.label === "한끗 진단";
    if (categoryFilter === "build") return cat.label === "한끗 빌드";
    if (categoryFilter === "launch") return cat.label === "한끗 론칭";
    if (categoryFilter === "partner") return cat.label === "한끗 파트너";
    return true;
  });

  // Auth & Coaching stores
  const members = useAuthStore((s) => s.members);
  const addMember = useAuthStore((s) => s.addMember);
  const removeMember = useAuthStore((s) => s.removeMember);

  const getSession = useCoachingStore((s) => s.getSession);
  const getCompletedCount = useCoachingStore((s) => s.getCompletedCount);
  const getProgress = useCoachingStore((s) => s.getProgress);

  // Member management states
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    password: "",
    productKey: "diagnosis",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  // State for copy notification
  const [issuedInfo, setIssuedInfo] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const { name, email, password, productKey } = newMember;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError("모든 필수 필드를 입력해 주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("유효한 이메일 주소를 입력해 주세요.");
      return;
    }

    const emailExists = members.some(
      (m) => m.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (emailExists) {
      setFormError("이미 등록된 이메일 ID입니다.");
      return;
    }

    // Issue/create member
    addMember({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      productKey,
    });

    setIssuedInfo({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    });

    setFormSuccess(`${name}님의 계정이 발급되었습니다.`);
    setNewMember({
      name: "",
      email: "",
      password: "",
      productKey: "diagnosis",
    });

    toast({
      title: "회원 ID 발급 완료",
      description: `${name}님의 계정 정보가 성공적으로 생성되었습니다.`,
    });
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`${name}님의 계정을 삭제하시겠습니까?\n작성 중이던 코칭 답변 데이터도 함께 삭제될 수 있습니다.`)) {
      removeMember(id);
      if (expandedMemberId === id) {
        setExpandedMemberId(null);
      }
      toast({
        title: "계정 삭제 완료",
        description: `${name}님의 계정이 삭제되었습니다.`,
        variant: "destructive",
      });
    }
  };

  const copyMemberNotice = (member: any) => {
    const loginUrl = `${window.location.origin}/login`;
    const message = `안녕하세요 ${member.name}님, 한끗프로젝트입니다.

${member.name}님의 나다운 브랜딩 코칭을 위한 멤버 전용 계정이 다음과 같이 발급되었습니다.

■ 로그인 주소: ${loginUrl}
■ 로그인 ID (이메일): ${member.email}
■ 임시 비밀번호: ${member.password}

💡 스마트폰에서 본 메시지의 아이디와 비밀번호를 꾹 눌러 복사하신 후 로그인 창에 차례로 붙여넣으시면 편리하게 접속하실 수 있습니다.

감사합니다.`;

    navigator.clipboard.writeText(message);
    toast({
      title: "안내 문구 복사 완료",
      description: `${member.name}님의 계정 정보 안내문이 복사되었습니다.`,
    });
  };

  return (
    <AdminGate>
      <div className="container-prose py-16 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 border-b border-border pb-6 mb-8">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-accent font-bold">
              <Shield size={14} />
              <span>ADMIN CONSOLE</span>
            </div>
            <h1 className="font-serif mt-2 text-3xl md:text-4xl text-primary font-bold">
              한끗 관리자 콘솔
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              신청인 상담 리드 목록 및 코칭 멤버들의 42문항 답변 현황을 관리하고 ID를 발급합니다.
            </p>
          </div>

          {/* 알림 센터 (Premium Notification Center) */}
          <div className="relative z-50 self-end mb-1">
            {/* Bell Button */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-full hover:bg-secondary/60 transition-all border border-border bg-card shadow-soft text-foreground flex items-center justify-center"
              title="실시간 제출 알림"
            >
              <Bell size={18} className={unreadCount > 0 ? "text-primary animate-bounce" : "text-muted-foreground"} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-white font-mono text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-background animate-pulse shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Overlay */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-md border border-[#1E2D8C]/15 rounded-3xl shadow-xl z-50 py-4 px-4 slide-down overflow-hidden">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-sm font-extrabold text-[#1E2D8C]">알림 센터</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-[#1E2D8C]/10 text-[#1E2D8C] px-1.5 py-0.5 rounded font-mono font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-[10px] text-accent hover:underline font-semibold"
                    >
                      모두 읽음
                    </button>
                    <span className="text-[10px] text-muted-foreground">|</span>
                    <button
                      onClick={() => clearNotifications()}
                      className="text-[10px] text-destructive hover:underline font-semibold"
                    >
                      비우기
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted-foreground italic">
                      최근 접수된 알림이 없습니다.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          setShowNotifications(false);
                          navigate(`/coaching/workspace/${notif.memberId}`);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 text-left ${
                          notif.isRead
                            ? "bg-secondary/10 border-border/40 hover:bg-secondary/20"
                            : "bg-[#F0EFFB]/40 border-[#1E2D8C]/15 hover:bg-[#F0EFFB]/60 shadow-sm"
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-foreground">
                            {notif.memberName}님의 답변 제출 완료
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            AI 분석 완료 &middot; {getRelativeTime(notif.timestamp)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 self-center">
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          )}
                          <span className="text-[10px] text-accent font-bold group-hover:underline whitespace-nowrap">
                            이동 &rarr;
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-secondary/30 p-1 rounded-xl">
            <TabsTrigger
              value="leads"
              className="py-2.5 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              상담 리드 관리 ({leads.length})
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="py-2.5 rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              코칭 회원 및 ID 관리 ({members.length})
            </TabsTrigger>
          </TabsList>

          {/* 1. Leads Management Tab */}
          <TabsContent value="leads" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-primary font-serif">상담 신청 리드 관리</h2>
              <p className="text-xs text-muted-foreground">
                {categoryFilter !== "all"
                  ? `필터 검색 결과: ${filteredLeads.length}건 (전체 ${leads.length}건)`
                  : `총 ${leads.length}건의 리드가 존재합니다.`}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-4 bg-secondary/15 p-2 rounded-xl border border-border/60">
              {[
                { key: "all", label: "전체", count: leads.length },
                { key: "free", label: "무료상담", count: leads.filter(l => getApplyCategory(l).label === "무료상담").length },
                { key: "diagnosis", label: "한끗 진단", count: leads.filter(l => getApplyCategory(l).label === "한끗 진단").length },
                { key: "build", label: "한끗 빌드", count: leads.filter(l => getApplyCategory(l).label === "한끗 빌드").length },
                { key: "launch", label: "한끗 론칭", count: leads.filter(l => getApplyCategory(l).label === "한끗 론칭").length },
                { key: "partner", label: "한끗 파트너", count: leads.filter(l => getApplyCategory(l).label === "한끗 파트너").length },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategoryFilter(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    categoryFilter === item.key
                      ? "bg-primary text-white shadow-soft"
                      : "hover:bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`font-mono text-[10px] rounded-full px-1.5 ${
                    categoryFilter === item.key ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
                  }`}>
                    {item.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="overflow-x-auto border border-border rounded-[var(--radius)] bg-card shadow-soft">
              {leads.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground text-sm">
                  아직 등록된 리드가 없습니다.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs tracking-widest text-muted-foreground">
                    <tr className="text-left border-b border-border">
                      <th className="px-4 py-3 font-medium">이름</th>
                      <th className="px-4 py-3 font-medium">신청 구분</th>
                      <th className="px-4 py-3 font-medium">연락처</th>
                      <th className="px-4 py-3 font-medium">점수</th>
                      <th className="px-4 py-3 font-medium">진단 유형</th>
                      <th className="px-4 py-3 font-medium">추천 패키지</th>
                      <th className="px-4 py-3 font-medium">상태</th>
                      <th className="px-4 py-3 font-medium min-w-[200px]">메모</th>
                      <th className="px-4 py-3 font-medium">신청일</th>
                      <th className="px-4 py-3 font-medium">상세</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-16 text-center text-muted-foreground text-xs italic">
                          해당 신청 구분에 접수된 리드가 존재하지 않습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((l) => (
                        <React.Fragment key={l.id}>
                        <tr className="border-t border-border align-top">
                          <td className="px-4 py-4">
                            <p className="font-medium text-primary">{l.name}</p>
                            <p className="text-xs text-muted-foreground">{l.field}</p>
                          </td>
                          <td className="px-4 py-4">
                            {(() => {
                              const cat = getApplyCategory(l);
                              return (
                                <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cat.className}`}>
                                  {cat.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-4 py-4">
                            <p>{l.phone}</p>
                            <p className="text-xs text-muted-foreground">{l.email}</p>
                          </td>
                          <td className="px-4 py-4 font-mono text-accent">
                            {l.diagnosticScore ?? "—"}
                          </td>
                          <td className="px-4 py-4">{l.diagnosticType ? l.diagnosticType : "—"}</td>
                          <td className="px-4 py-4">
                            {l.recommendedPackage ? PACKAGES[l.recommendedPackage as "positioning" | "vvip"]?.title : "—"}
                          </td>
                          <td className="px-4 py-4">
                            <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v as any)}>
                              <SelectTrigger className="h-9 w-[120px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {LEAD_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-4">
                            <Textarea
                              rows={2}
                              value={l.memo}
                              onChange={(e) => updateMemo(l.id, e.target.value)}
                              placeholder="메모"
                              className="text-xs"
                            />
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(l.createdAt).toLocaleString("ko-KR")}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => setExpandedLeadId(expandedLeadId === l.id ? null : l.id)}
                              className="text-xs font-bold text-accent hover:underline whitespace-nowrap mt-1"
                            >
                              {expandedLeadId === l.id ? "닫기 ▲" : "보기 ▼"}
                            </button>
                          </td>
                        </tr>
                        {expandedLeadId === l.id && (
                          <tr className="bg-secondary/15 border-t border-border">
                            <td colSpan={10} className="px-6 py-6 text-foreground">
                              <div className="grid gap-6 md:grid-cols-2">
                                {/* 1. 영역별 자산 점수 및 요구사항 */}
                                <div>
                                  <h4 className="font-bold text-xs text-accent tracking-widest uppercase mb-3">🛡️ 영역별 자산 점수</h4>
                                  {l.scores ? (
                                    <div className="space-y-2 text-xs border border-border/80 p-4 rounded bg-background shadow-soft">
                                      <div className="flex justify-between"><span>정체성 명확도:</span> <span className="font-mono text-accent font-bold">{l.scores.identity}점</span></div>
                                      <div className="flex justify-between"><span>강점 자산 인식도:</span> <span className="font-mono text-accent font-bold">{l.scores.strengths}점</span></div>
                                      <div className="flex justify-between"><span>타깃 설계도:</span> <span className="font-mono text-accent font-bold">{l.scores.target}점</span></div>
                                      <div className="flex justify-between"><span>차별화 인식도:</span> <span className="font-mono text-accent font-bold">{l.scores.differentiation}점</span></div>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">영역별 점수 데이터가 없습니다.</p>
                                  )}

                                  <h4 className="font-bold text-xs text-accent tracking-widest uppercase mt-6 mb-3">📂 상담 세부 요구사항</h4>
                                  <div className="space-y-3 text-xs border border-border/80 p-4 rounded bg-background shadow-soft">
                                    <div><span className="font-semibold text-muted-foreground">관심 목적:</span> <span className="font-medium text-foreground">{l.purposes?.join(", ") || "없음"}</span></div>
                                    <div><span className="font-semibold text-muted-foreground">원하는 결과물:</span> <span className="font-medium text-foreground">{l.outcomes?.join(", ") || "없음"}</span></div>
                                    <div><span className="font-semibold text-muted-foreground">상담 희망 방식:</span> <span className="font-medium text-foreground">{l.channel || "없음"}</span></div>
                                    <div className="mt-3">
                                      <span className="font-semibold text-muted-foreground block mb-1">상세 경력:</span>
                                      <p className="bg-secondary/40 border border-border/40 p-2.5 rounded text-foreground whitespace-pre-wrap leading-relaxed">{l.career || "입력 없음"}</p>
                                    </div>
                                    <div className="mt-3">
                                      <span className="font-semibold text-muted-foreground block mb-1">현재 가장 어려운 점:</span>
                                      <p className="bg-secondary/40 border border-border/40 p-2.5 rounded text-foreground whitespace-pre-wrap leading-relaxed">{l.challenge || "입력 없음"}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* 2. 무료 진단 답변 전문 */}
                                <div>
                                  <h4 className="font-bold text-xs text-accent tracking-widest uppercase mb-3">📝 무료 진단 답변 전문 (7문항)</h4>
                                  {l.answers ? (
                                    <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2 border border-border/80 p-4 rounded bg-background shadow-soft">
                                      {FREE_DIAGNOSTIC_QUESTIONS.map((q) => (
                                        <div key={q.id} className="border-b border-border/60 pb-3 last:border-0 text-xs">
                                          <p className="font-semibold text-primary/95 mb-1.5">Q{q.id}. {q.question}</p>
                                          <p className="bg-secondary/20 border border-border/30 p-2.5 rounded text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                            {l.answers?.[q.id] || "답변 없음"}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">이 리드는 진단 답변 데이터가 저장되어 있지 않습니다.</p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          {/* 2. Member Management Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left Column: Register Form */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-soft h-fit">
                <div className="flex items-center gap-2 mb-5">
                  <UserPlus className="text-primary h-5 w-5" />
                  <h3 className="font-bold text-lg text-primary font-serif">신규 회원 ID 발급</h3>
                </div>

                <form onSubmit={handleCreateMember} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                      회원 이름 (필수)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                      <input
                        type="text"
                        required
                        placeholder="김지영"
                        className="w-full h-10 pl-9 pr-4 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                        value={newMember.name}
                        onChange={(e) => setNewMember((n) => ({ ...n, name: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                      멤버 ID 이메일 (필수)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                      <input
                        type="email"
                        required
                        placeholder="user@example.com"
                        className="w-full h-10 pl-9 pr-4 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                        value={newMember.email}
                        onChange={(e) => setNewMember((n) => ({ ...n, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                      비밀번호 (필수)
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                      <input
                        type="text"
                        required
                        placeholder="임시 비밀번호"
                        className="w-full h-10 pl-9 pr-4 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                        value={newMember.password}
                        onChange={(e) => setNewMember((n) => ({ ...n, password: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                      신청 상품 패키지
                    </label>
                    <Select
                      value={newMember.productKey}
                      onValueChange={(val) => setNewMember((n) => ({ ...n, productKey: val }))}
                    >
                      <SelectTrigger className="h-10 text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRODUCT_LABELS).map(([k, label]) => (
                          <SelectItem key={k} value={k} className="text-xs">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formError && (
                    <div className="flex items-start gap-2 p-3 text-xs text-destructive bg-destructive/5 rounded-xl border border-destructive/10">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formSuccess && (
                    <div className="flex items-start gap-2 p-3 text-xs text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-xl text-xs font-bold hover:bg-primary/95 transition-all shadow-soft flex items-center justify-center gap-1.5"
                  >
                    <UserPlus size={14} />
                    계정 발급 및 저장
                  </button>
                </form>

                {issuedInfo && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        발급 완료 및 복사
                      </span>
                      <button
                        type="button"
                        onClick={() => setIssuedInfo(null)}
                        className="text-[10px] text-muted-foreground hover:underline"
                      >
                        숨기기
                      </button>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-emerald-100 font-mono text-[9px] text-foreground/80 leading-relaxed whitespace-pre-wrap select-all">
                      {`안녕하세요 ${issuedInfo.name}님, 한끗프로젝트입니다.

${issuedInfo.name}님의 나다운 브랜딩 코칭을 위한 멤버 전용 계정이 다음과 같이 발급되었습니다.

■ 로그인 주소: ${window.location.origin}/login
■ 로그인 ID (이메일): ${issuedInfo.email}
■ 임시 비밀번호: ${issuedInfo.password}

💡 스마트폰에서 본 메시지의 아이디와 비밀번호를 꾹 눌러 복사하신 후 로그인 창에 차례로 붙여넣으시면 편리하게 접속하실 수 있습니다.

감사합니다.`}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const loginUrl = `${window.location.origin}/login`;
                        const message = `안녕하세요 ${issuedInfo.name}님, 한끗프로젝트입니다.

${issuedInfo.name}님의 나다운 브랜딩 코칭을 위한 멤버 전용 계정이 다음과 같이 발급되었습니다.

■ 로그인 주소: ${loginUrl}
■ 로그인 ID (이메일): ${issuedInfo.email}
■ 임시 비밀번호: ${issuedInfo.password}

💡 스마트폰에서 본 메시지의 아이디와 비밀번호를 꾹 눌러 복사하신 후 로그인 창에 차례로 붙여넣으시면 편리하게 접속하실 수 있습니다.

감사합니다.`;
                        navigator.clipboard.writeText(message);
                        toast({
                          title: "안내 문구 복사 완료",
                          description: `${issuedInfo.name}님께 카카오톡이나 문자로 전송해 보세요!`,
                        });
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </svg>
                      카카오톡 안내문 복사
                    </button>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-border/80 text-[11px] text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground/80 mb-1">💡 테스트 팁:</p>
                  이메일 ID와 비밀번호를 직접 설정하고 생성한 뒤, <a href="/login" target="_blank" className="text-primary underline font-bold">로그인 페이지</a>에서 로그인하여 고객용 42문항 자가 진단 및 대시보드를 직접 테스트할 수 있습니다.
                </div>
              </div>

              {/* Right Column: Member Accounts Table */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-primary font-serif">발급된 회원 관리</h3>
                  <span className="text-xs text-muted-foreground">총 {members.length}명</span>
                </div>

                <div className="overflow-x-auto border border-border rounded-[var(--radius)] bg-card shadow-soft">
                  {members.length === 0 ? (
                    <div className="p-16 text-center text-muted-foreground text-xs italic">
                      발급된 회원 계정이 없습니다. 왼쪽 폼에서 첫 회원을 등록하세요.
                    </div>
                  ) : (
                    <table className="w-full text-xs">
                      <thead className="bg-secondary/60 text-xs tracking-widest text-muted-foreground">
                        <tr className="text-left border-b border-border">
                          <th className="px-4 py-3 font-medium">이름</th>
                          <th className="px-4 py-3 font-medium">이메일 ID</th>
                          <th className="px-4 py-3 font-medium">비밀번호</th>
                          <th className="px-4 py-3 font-medium">가입 서비스</th>
                          <th className="px-4 py-3 font-medium">진행 현황</th>
                          <th className="px-4 py-3 font-medium">상태</th>
                          <th className="px-4 py-3 font-medium text-right">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => {
                          const session = getSession(m.id);
                          const completedCount = getCompletedCount(m.id);
                          const progress = getProgress(m.id);
                          const isSubmitted = session.status === "submitted";

                          return (
                            <React.Fragment key={m.id}>
                              <tr className="border-t border-border align-middle">
                                <td className="px-4 py-4 font-semibold text-primary">
                                  {m.name}
                                </td>
                                <td className="px-4 py-4 font-mono">{m.email}</td>
                                <td className="px-4 py-4 font-mono text-muted-foreground">
                                  {m.password}
                                </td>
                                <td className="px-4 py-4">
                                  {PRODUCT_LABELS[m.productKey] || m.productKey}
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                    <span className="font-mono text-[10px] font-bold">
                                      {completedCount}/42 ({progress}%)
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  {session.status === "finalized" ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C4A265] bg-amber-50 border border-[#C4A265]/20 px-2 py-0.5 rounded-full">
                                      최종 완료
                                    </span>
                                  ) : session.status === "analyzing" ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full animate-pulse">
                                      분석 중
                                    </span>
                                  ) : session.status === "submitted" || session.status === "analyzed" ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                                      코칭 대기
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                      작성 중
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-right space-x-2">
                                  {session.status !== "in-progress" && session.status !== "analyzing" && (
                                    <Link
                                      to={`/coaching/workspace/${m.id}`}
                                      className="text-xs font-bold text-[#C4A265] hover:underline whitespace-nowrap mr-2"
                                    >
                                      {session.status === "finalized" ? "코칭 수정" : "코칭 시작 ➔"}
                                    </Link>
                                  )}
                                  <button
                                    onClick={() => copyMemberNotice(m)}
                                    className="text-xs font-bold text-emerald-600 hover:underline whitespace-nowrap"
                                    title="안내문구 복사"
                                  >
                                    안내문 복사
                                  </button>
                                  <button
                                    onClick={() =>
                                      setExpandedMemberId(
                                        expandedMemberId === m.id ? null : m.id
                                      )
                                    }
                                    className="text-xs font-bold text-accent hover:underline whitespace-nowrap"
                                  >
                                    {expandedMemberId === m.id ? "답변 닫기" : "답변 조회"}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMember(m.id, m.name)}
                                    className="text-destructive hover:text-destructive/80 inline-flex items-center align-middle"
                                    title="계정 삭제"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>

                              {/* Member Coaching Answers Detailed Expand */}
                              {expandedMemberId === m.id && (
                                <tr className="bg-secondary/15 border-t border-border">
                                  <td colSpan={7} className="px-6 py-6 text-foreground">
                                    <div className="space-y-6">
                                      <div className="flex items-center justify-between border-b border-border/80 pb-3">
                                        <div>
                                          <h4 className="font-bold text-primary text-base font-serif">
                                            {m.name}님의 42문항 답변 목록
                                          </h4>
                                          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
                                            <span className="flex items-center gap-0.5">
                                              <FileText size={12} />
                                              응답 완료: {completedCount} / 42개
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-0.5">
                                              <Clock size={12} />
                                              진행률: {progress}%
                                            </span>
                                            {session.submittedAt && (
                                              <>
                                                <span>•</span>
                                                <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
                                                  <CheckCircle size={12} />
                                                  최종 제출일: {new Date(session.submittedAt).toLocaleString("ko-KR")}
                                                </span>
                                              </>
                                            )}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => setExpandedMemberId(null)}
                                          className="text-xs font-bold text-accent hover:underline"
                                        >
                                          답변 닫기 ▲
                                        </button>
                                      </div>

                                      {/* Accordion or Grid by Coaching Part */}
                                      <div className="grid gap-6 md:grid-cols-2">
                                        {COACHING_PARTS.map((part, partIdx) => {
                                          const partQuestions = COACHING_QUESTIONS.filter(
                                            (q) => q.part === part.key
                                          );
                                          const answeredQuestions = partQuestions.filter((q) => {
                                            const ans = session.answers[q.id];
                                            return (
                                              ans &&
                                              ((ans.text && ans.text.trim().length > 0) || ans.voice)
                                            );
                                          });

                                          return (
                                            <div
                                              key={part.key}
                                              className="border border-border/80 p-4 rounded-2xl bg-background shadow-soft"
                                            >
                                              <h5 className="font-bold text-xs text-accent tracking-widest uppercase mb-3 flex items-center justify-between border-b border-border/40 pb-2">
                                                <span className="flex items-center gap-1">
                                                  <Award size={13} />
                                                  PART {partIdx + 1}. {part.title}
                                                </span>
                                                <span className="font-mono text-muted-foreground text-[10px]">
                                                  {answeredQuestions.length}/{partQuestions.length}
                                                </span>
                                              </h5>

                                              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                                                {partQuestions.map((q) => {
                                                  const ans = session.answers[q.id];
                                                  const hasAnswer =
                                                    ans &&
                                                    ((ans.text && ans.text.trim().length > 0) ||
                                                      ans.voice);

                                                  return (
                                                    <div
                                                      key={q.id}
                                                      className={`pb-3 last:border-0 border-b border-border/30 ${hasAnswer ? "" : "opacity-45"
                                                        }`}
                                                    >
                                                      <p className="font-semibold text-primary/95 text-[11px] leading-relaxed">
                                                        Q{q.id}. {q.question}
                                                      </p>
                                                      {hasAnswer ? (
                                                        <div className="mt-2 space-y-2 pl-1.5">
                                                          {ans.text && (
                                                            <p className="bg-secondary/20 border border-border/30 p-2.5 rounded-xl text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                                              {ans.text}
                                                            </p>
                                                          )}
                                                          {ans.voice && (
                                                            <div className="p-2 bg-[#F0EFFB]/40 rounded-xl border border-[#1E2D8C]/10 flex items-center justify-between gap-3 flex-wrap">
                                                              <span className="text-[10px] font-semibold text-[#1E2D8C] flex items-center gap-1 shrink-0">
                                                                <Volume2 size={12} />
                                                                음성 ({Math.round(ans.voice.duration)}초)
                                                              </span>
                                                              <audio
                                                                controls
                                                                src={ans.voice.data}
                                                                className="h-8 max-w-[200px]"
                                                              />
                                                            </div>
                                                          )}
                                                        </div>
                                                      ) : (
                                                        <p className="text-[10px] text-muted-foreground italic mt-1 pl-2">
                                                          — 답변 없음
                                                        </p>
                                                      )}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  );
}

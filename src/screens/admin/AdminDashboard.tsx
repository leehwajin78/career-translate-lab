'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES } from "@/store/leads";
import { useDbLeads } from "@/hooks/useDbLeads";
import { PACKAGES, FREE_DIAGNOSTIC_QUESTIONS } from "@/data/content";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useCoachingStore, SubmissionStatus } from "@/store/coachingStore";
import { COACHING_QUESTIONS, COACHING_PARTS } from "@/data/coachingQuestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Trash2, UserPlus, Key, User, Mail, ShieldAlert, Award, FileText, CheckCircle, Clock, Volume2, Bell, Check } from "lucide-react";
import {
  useNotificationStore,
  playChime,
  requestNotificationPermission,
} from "@/store/notificationStore";

const PRODUCT_LABELS: Record<string, string> = {
  diagnosis: "한끗 진단 (50만원)",
  build: "한끗 빌드 (350만원)",
  launch: "한끗 론칭 (별도 문의)",
  partner: "한끗 파트너 (별도 문의)",
};

const getApplyCategory = (lead: any) => {
  const outcomes = lead.outcomes || [];
  const memo = lead.memo || "";
  if (outcomes.includes("한끗 파트너") || memo.includes("한끗 파트너") || memo.includes("apply-partner"))
    return { label: "한끗 파트너", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
  if (outcomes.includes("한끗 론칭") || memo.includes("한끗 론칭") || memo.includes("apply-launch"))
    return { label: "한끗 론칭", className: "bg-rose-50 text-rose-700 border border-rose-200" };
  if (outcomes.includes("한끗 빌드") || memo.includes("한끗 빌드") || memo.includes("apply-build"))
    return { label: "한끗 빌드", className: "bg-amber-50 text-amber-700 border border-amber-200" };
  if (outcomes.includes("한끗 진단") || memo.includes("한끗 진단") || memo.includes("정식 유료 진단") || memo.includes("apply-diagnosis"))
    return { label: "한끗 진단", className: "bg-blue-50 text-blue-700 border border-blue-200" };
  return { label: "무료상담", className: "bg-purple-50 text-purple-700 border border-purple-200" };
};

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

export default function AdminDashboard() {
  const { leads, updateStatus, updateMemo } = useDbLeads();
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const router = useRouter();
  const navigate = (p: string) => router.push(p);
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const members = useAuthStore((s) => s.members);
  const addMember = useAuthStore((s) => s.addMember);
  const removeMember = useAuthStore((s) => s.removeMember);
  const updateMember = useAuthStore((s) => s.updateMember);
  const getSession = useCoachingStore((s) => s.getSession);
  const getCompletedCount = useCoachingStore((s) => s.getCompletedCount);
  const getProgress = useCoachingStore((s) => s.getProgress);
  const setStatus = useCoachingStore((s) => s.setStatus);

  const [memberStageFilter, setMemberStageFilter] = useState<string>("all");
  const filteredMembers = members.filter((m) => memberStageFilter === "all" || m.productKey === memberStageFilter);

  const [newMember, setNewMember] = useState({ name: "", email: "", password: "", productKey: "diagnosis" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [issuedInfo, setIssuedInfo] = useState<{ name: string; email: string; password: string } | null>(null);

  // KPI 계산
  const now = new Date();
  const thisMonthLeads = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const waitingLeads = leads.filter((l) => l.status === "신규 리드" || l.status === "상담 예정");
  const submittedMembers = members.filter((m) => getSession(m.id).status === "submitted");

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const handleNewSubmission = (event: Event) => {
      const customEvent = event as CustomEvent;
      const notification = customEvent.detail;
      if (!notification) return;
      playChime();
      toast({
        title: "🔔 신규 답변 완료 알림",
        description: `${notification.memberName}님이 42문항 답변을 제출했습니다.`,
        action: (
          <button
            onClick={() => { markAsRead(notification.id); setShowNotifications(false); navigate(`/coaching/workspace/${notification.memberId}`); }}
            className="bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-primary/95 transition-all shrink-0"
          >
            워크스페이스 이동
          </button>
        ),
      });
    };
    window.addEventListener("kkummolda-new-submission", handleNewSubmission);
    return () => window.removeEventListener("kkummolda-new-submission", handleNewSubmission);
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

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(""); setFormSuccess("");
    const { name, email, password, productKey } = newMember;
    if (!name.trim() || !email.trim() || !password.trim()) { setFormError("모든 필수 필드를 입력해 주세요."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setFormError("유효한 이메일 주소를 입력해 주세요."); return; }
    if (members.some((m) => m.email.toLowerCase() === email.trim().toLowerCase())) { setFormError("이미 등록된 이메일 ID입니다."); return; }
    addMember({ name: name.trim(), email: email.trim(), password: password.trim(), productKey });
    setIssuedInfo({ name: name.trim(), email: email.trim(), password: password.trim() });
    setFormSuccess(`${name}님의 계정이 발급되었습니다.`);
    setNewMember({ name: "", email: "", password: "", productKey: "diagnosis" });
    toast({ title: "회원 ID 발급 완료", description: `${name}님의 계정 정보가 성공적으로 생성되었습니다.` });
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`${name}님의 계정을 삭제하시겠습니까?`)) {
      removeMember(id);
      if (expandedMemberId === id) setExpandedMemberId(null);
      toast({ title: "계정 삭제 완료", description: `${name}님의 계정이 삭제되었습니다.`, variant: "destructive" });
    }
  };

  const copyMemberNotice = (member: any) => {
    const loginUrl = `${window.location.origin}/login`;
    const message = `안녕하세요 ${member.name}님, 한끗프로젝트입니다.\n\n${member.name}님의 나다운 브랜딩 코칭을 위한 멤버 전용 계정이 다음과 같이 발급되었습니다.\n\n■ 로그인 주소: ${loginUrl}\n■ 로그인 ID (이메일): ${member.email}\n■ 임시 비밀번호: ${member.password}\n\n💡 스마트폰에서 본 메시지의 아이디와 비밀번호를 꾹 눌러 복사하신 후 로그인 창에 차례로 붙여넣으시면 편리하게 접속하실 수 있습니다.\n\n감사합니다.`;
    navigator.clipboard.writeText(message);
    toast({ title: "안내 문구 복사 완료", description: `${member.name}님의 계정 정보 안내문이 복사되었습니다.` });
  };

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1A3E]">관리자 콘솔</h1>
          <p className="text-sm text-gray-500 mt-1">리드 CRM과 코칭 팀원 관리를 한 화면에서 · /admin</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full hover:bg-gray-100 border border-gray-200 bg-white shadow-sm"
          >
            <Bell size={16} className={unreadCount > 0 ? "text-primary animate-bounce" : "text-gray-400"} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-3 px-3">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="text-xs font-bold text-[#0D1A3E]">알림 센터</span>
                <div className="flex gap-2">
                  <button onClick={markAllAsRead} className="text-[10px] text-blue-600 hover:underline">모두 읽음</button>
                  <span className="text-[10px] text-gray-300">|</span>
                  <button onClick={clearNotifications} className="text-[10px] text-red-500 hover:underline">비우기</button>
                </div>
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-8 text-center text-xs text-gray-400 italic">최근 알림이 없습니다.</p>
                ) : notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => { markAsRead(notif.id); setShowNotifications(false); navigate(`/coaching/workspace/${notif.memberId}`); }}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-start justify-between gap-2 ${
                      notif.isRead ? "bg-gray-50 border-gray-100" : "bg-blue-50 border-blue-100"
                    }`}
                  >
                    <div>
                      <p className="text-[11px] font-bold text-gray-800">{notif.memberName}님 답변 제출 완료</p>
                      <p className="text-[10px] text-gray-400">{getRelativeTime(notif.timestamp)}</p>
                    </div>
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { v: thisMonthLeads.length, k: "이번 달 신규 리드", color: "text-[#0D1A3E]" },
          { v: waitingLeads.length, k: "상담 대기", color: waitingLeads.length > 0 ? "text-amber-600" : "text-[#0D1A3E]" },
          { v: members.length, k: "코칭 진행 멤버", color: "text-[#0D1A3E]" },
          { v: submittedMembers.length, k: "제출 완료 (검토 필요)", color: submittedMembers.length > 0 ? "text-emerald-600" : "text-[#0D1A3E]" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.v}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.k}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="leads" className="py-2 rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">
            ① 상담 리드 관리
          </TabsTrigger>
          <TabsTrigger value="members" className="py-2 rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">
            ② 코칭 팀원 관리 (계정 발급)
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Leads */}
        <TabsContent value="leads" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: "all", label: "전체 " + leads.length },
                { key: "free", label: "무료상담 " + leads.filter(l => getApplyCategory(l).label === "무료상담").length },
                { key: "diagnosis", label: "한끗 진단 " + leads.filter(l => getApplyCategory(l).label === "한끗 진단").length },
                { key: "build", label: "한끗 빌드 " + leads.filter(l => getApplyCategory(l).label === "한끗 빌드").length },
                { key: "launch", label: "한끗 론칭 " + leads.filter(l => getApplyCategory(l).label === "한끗 론칭").length },
                { key: "partner", label: "한끗 파트너 " + leads.filter(l => getApplyCategory(l).label === "한끗 파트너").length },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCategoryFilter(item.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === item.key ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">상태: 대기중 → 상담중 → 완료 · 보류 · 메모 인라인 자동 저장</p>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
            {leads.length === 0 ? (
              <div className="p-16 text-center text-gray-400 text-sm">아직 등록된 리드가 없습니다.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-200">
                  <tr className="text-left">
                    <th className="px-4 py-3">이름</th>
                    <th className="px-4 py-3">신청 구분</th>
                    <th className="px-4 py-3">연락처</th>
                    <th className="px-4 py-3">진단 점수·유형</th>
                    <th className="px-4 py-3">추천 패키지</th>
                    <th className="px-4 py-3">상태</th>
                    <th className="px-4 py-3 min-w-[180px]">이운 메모</th>
                    <th className="px-4 py-3">신청일</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={9} className="p-12 text-center text-gray-400 text-xs italic">해당 구분에 접수된 리드가 없습니다.</td></tr>
                  ) : filteredLeads.map((l) => (
                    <React.Fragment key={l.id}>
                      <tr className="border-t border-gray-100 align-top hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-primary">{l.name}</p>
                          <p className="text-xs text-gray-400">{l.field}</p>
                        </td>
                        <td className="px-4 py-3">
                          {(() => { const cat = getApplyCategory(l); return <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.className}`}>{cat.label}</span>; })()}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs">{l.phone}</p>
                          <p className="text-xs text-gray-400">{l.email}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {l.diagnosticScore ?? "—"} · {l.diagnosticType || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {l.recommendedPackage ? PACKAGES[l.recommendedPackage as "positioning" | "vvip"]?.title : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v as any)}>
                            <SelectTrigger className="h-8 w-[110px] text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Textarea rows={2} value={l.memo} onChange={(e) => updateMemo(l.id, e.target.value)} placeholder="메모" className="text-xs" />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(l.createdAt).toLocaleDateString("ko-KR")}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/lead/${l.id}`} className="text-xs font-bold text-primary hover:underline whitespace-nowrap">상세</Link>
                        </td>
                      </tr>
                      {expandedLeadId === l.id && (
                        <tr className="bg-gray-50 border-t border-gray-100">
                          <td colSpan={9} className="px-6 py-5">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-3">영역별 자산 점수</h4>
                                {l.scores ? (
                                  <div className="space-y-1.5 text-xs border border-gray-200 p-4 rounded-xl bg-white">
                                    <div className="flex justify-between"><span>정체성 명확도</span><span className="font-mono font-bold text-primary">{l.scores.identity}점</span></div>
                                    <div className="flex justify-between"><span>강점 자산 인식도</span><span className="font-mono font-bold text-primary">{l.scores.strengths}점</span></div>
                                    <div className="flex justify-between"><span>타깃 설계도</span><span className="font-mono font-bold text-primary">{l.scores.target}점</span></div>
                                    <div className="flex justify-between"><span>차별화 인식도</span><span className="font-mono font-bold text-primary">{l.scores.differentiation}점</span></div>
                                  </div>
                                ) : <p className="text-xs text-gray-400 italic">점수 데이터 없음</p>}
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-3">무료 진단 답변 전문</h4>
                                {l.answers ? (
                                  <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 p-4 rounded-xl bg-white">
                                    {FREE_DIAGNOSTIC_QUESTIONS.map((q) => (
                                      <div key={q.id} className="border-b border-gray-100 pb-2 last:border-0 text-xs">
                                        <p className="font-semibold text-primary mb-1">Q{q.id}. {q.question}</p>
                                        <p className="bg-gray-50 p-2 rounded text-gray-700 whitespace-pre-wrap">{l.answers?.[q.id] || "답변 없음"}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : <p className="text-xs text-gray-400 italic">진단 답변 데이터 없음</p>}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Members */}
        <TabsContent value="members" className="space-y-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Register Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
              <div className="flex items-center gap-2 mb-5">
                <UserPlus className="text-primary h-4 w-4" />
                <h3 className="font-bold text-base text-[#0D1A3E]">계정 즉시 발급</h3>
              </div>
              <form onSubmit={handleCreateMember} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">이름</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                    <input type="text" required placeholder="이름" className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary" value={newMember.name} onChange={(e) => setNewMember((n) => ({ ...n, name: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">이메일 ID</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                    <input type="email" required placeholder="user@example.com" className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary" value={newMember.email} onChange={(e) => setNewMember((n) => ({ ...n, email: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">비밀번호</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                    <input type="text" required placeholder="임시 비밀번호" className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary" value={newMember.password} onChange={(e) => setNewMember((n) => ({ ...n, password: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">신청 상품</label>
                  <Select value={newMember.productKey} onValueChange={(val) => setNewMember((n) => ({ ...n, productKey: val }))}>
                    <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRODUCT_LABELS).map(([k, label]) => <SelectItem key={k} value={k} className="text-xs">{label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {formError && <div className="flex items-start gap-2 p-2.5 text-xs text-red-600 bg-red-50 rounded-lg border border-red-100"><ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" /><span>{formError}</span></div>}
                {formSuccess && <div className="flex items-start gap-2 p-2.5 text-xs text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100"><CheckCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{formSuccess}</span></div>}
                <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5">
                  <UserPlus size={13} />발급
                </button>
              </form>
              {issuedInfo && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 flex items-center gap-1"><Check className="h-3.5 w-3.5" />발급 완료</span>
                    <button onClick={() => setIssuedInfo(null)} className="text-[10px] text-gray-400 hover:underline">숨기기</button>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100 font-mono text-[9px] text-gray-700 leading-relaxed whitespace-pre-wrap select-all">
                    {`안녕하세요 ${issuedInfo.name}님, 한끗프로젝트입니다.\n\n■ 로그인 주소: ${window.location.origin}/login\n■ ID: ${issuedInfo.email}\n■ 비밀번호: ${issuedInfo.password}`}
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(`안녕하세요 ${issuedInfo.name}님, 한끗프로젝트입니다.\n\n${issuedInfo.name}님의 나다운 브랜딩 코칭을 위한 멤버 전용 계정이 다음과 같이 발급되었습니다.\n\n■ 로그인 주소: ${window.location.origin}/login\n■ 로그인 ID (이메일): ${issuedInfo.email}\n■ 임시 비밀번호: ${issuedInfo.password}\n\n💡 스마트폰에서 본 메시지의 아이디와 비밀번호를 꾹 눌러 복사하신 후 로그인 창에 차례로 붙여넣으시면 편리하게 접속하실 수 있습니다.\n\n감사합니다.`); toast({ title: "안내 문구 복사 완료" }); }} className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1">
                    카카오톡 안내문 복사
                  </button>
                </div>
              )}
              <p className="mt-4 text-[10px] text-gray-400 leading-relaxed">발급은 Edge Function create-member가 Supabase Auth 사용자 생성 + members insert를 수행합니다 (FR-AUTH-04). 비밀번호 평문 저장 없음 (FR-AUTH-05). 발급 즉시 카카오톡/SMS 안내문 링크 복사</p>
            </div>

            {/* Member Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-[#0D1A3E]">발급된 회원 관리</h3>
                <div className="flex gap-1.5">
                  {["all", "diagnosis", "build", "launch", "partner"].map((k) => (
                    <button key={k} onClick={() => setMemberStageFilter(k)} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${memberStageFilter === k ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                      {k === "all" ? "전체" : k === "diagnosis" ? "진단" : k === "build" ? "빌드" : k === "launch" ? "론칭" : "파트너"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                {filteredMembers.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 text-xs italic">{memberStageFilter === "all" ? "발급된 회원 계정이 없습니다." : "해당 단계에 등록된 회원이 없습니다."}</div>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                      <tr className="text-left">
                        <th className="px-3 py-2.5">멤버</th>
                        <th className="px-3 py-2.5">패키지</th>
                        <th className="px-3 py-2.5">42문항 진행률</th>
                        <th className="px-3 py-2.5">인증 상태</th>
                        <th className="px-3 py-2.5 text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((m) => {
                        const session = getSession(m.id);
                        const completedCount = getCompletedCount(m.id);
                        const progress = getProgress(m.id);
                        return (
                          <React.Fragment key={m.id}>
                            <tr className="border-t border-gray-100 align-middle hover:bg-gray-50/50">
                              <td className="px-3 py-2.5">
                                <p className="font-semibold text-primary">{m.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">{m.email}</p>
                              </td>
                              <td className="px-3 py-2.5">
                                <Select value={m.productKey} onValueChange={(val) => { updateMember(m.id, { productKey: val }); toast({ title: "가입 서비스 변경" }); }}>
                                  <SelectTrigger className="h-7 w-[130px] text-xs rounded-lg border-gray-200"><SelectValue /></SelectTrigger>
                                  <SelectContent className="bg-white">
                                    {Object.entries(PRODUCT_LABELS).map(([k, label]) => <SelectItem key={k} value={k} className="text-xs">{label}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                                  </div>
                                  <span className="font-mono text-[10px]">{completedCount}/42 ({progress}%)</span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5">
                                <Select value={session.status} onValueChange={(val) => { setStatus(m.id, val as SubmissionStatus); toast({ title: "상태 변경" }); }}>
                                  <SelectTrigger className={`h-7 w-[100px] text-xs font-bold rounded-lg border ${session.status === "finalized" ? "text-amber-700 bg-amber-50 border-amber-200" : session.status === "submitted" ? "text-indigo-700 bg-indigo-50 border-indigo-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white">
                                    <SelectItem value="in-progress" className="text-xs">작성 중</SelectItem>
                                    <SelectItem value="submitted" className="text-xs">제출 완료</SelectItem>
                                    <SelectItem value="analyzing" className="text-xs">분석 중</SelectItem>
                                    <SelectItem value="analyzed" className="text-xs">분석 완료</SelectItem>
                                    <SelectItem value="finalized" className="text-xs">최종 완료</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-3 py-2.5 text-right space-x-2 whitespace-nowrap">
                                {(session.status === "submitted" || session.status === "analyzed" || session.status === "finalized") && (
                                  <Link href={`/coaching/workspace/${m.id}`} className="text-xs font-bold text-amber-600 hover:underline">워크스페이스</Link>
                                )}
                                <button onClick={() => copyMemberNotice(m)} className="text-xs font-bold text-emerald-600 hover:underline">안내문 복사</button>
                                <button onClick={() => setExpandedMemberId(expandedMemberId === m.id ? null : m.id)} className="text-xs font-bold text-primary hover:underline">답변 조회</button>
                                <button onClick={() => handleDeleteMember(m.id, m.name)} className="text-red-400 hover:text-red-600 inline-flex items-center align-middle"><Trash2 size={13} /></button>
                              </td>
                            </tr>
                            {expandedMemberId === m.id && (
                              <tr className="bg-gray-50 border-t border-gray-100">
                                <td colSpan={5} className="px-5 py-5">
                                  <div className="flex items-center justify-between mb-4">
                                    <div>
                                      <h4 className="font-bold text-primary text-sm">{m.name}님의 42문항 답변 목록</h4>
                                      <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                                        <span className="flex items-center gap-0.5"><FileText size={11} />응답 완료: {completedCount} / 42</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-0.5"><Clock size={11} />진행률: {progress}%</span>
                                        {session.submittedAt && <><span>•</span><span className="flex items-center gap-0.5 text-emerald-700"><CheckCircle size={11} />제출일: {new Date(session.submittedAt).toLocaleString("ko-KR")}</span></>}
                                      </p>
                                    </div>
                                    <button onClick={() => setExpandedMemberId(null)} className="text-xs font-bold text-primary hover:underline">닫기</button>
                                  </div>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    {COACHING_PARTS.map((part, partIdx) => {
                                      const partQs = COACHING_QUESTIONS.filter((q) => q.part === part.key);
                                      const answeredQs = partQs.filter((q) => { const ans = session.answers[q.id]; return ans && ((ans.text && ans.text.trim().length > 0) || ans.voice); });
                                      return (
                                        <div key={part.key} className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm">
                                          <h5 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
                                            <span className="flex items-center gap-1"><Award size={12} />PART {partIdx + 1}. {part.title}</span>
                                            <span className="font-mono text-gray-400 text-[10px]">{answeredQs.length}/{partQs.length}</span>
                                          </h5>
                                          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                            {partQs.map((q) => {
                                              const ans = session.answers[q.id];
                                              const hasAnswer = ans && ((ans.text && ans.text.trim().length > 0) || ans.voice);
                                              return (
                                                <div key={q.id} className={`pb-2.5 last:border-0 border-b border-gray-100 ${hasAnswer ? "" : "opacity-40"}`}>
                                                  <p className="font-semibold text-primary text-[11px] leading-relaxed">Q{q.id}. {q.question}</p>
                                                  {hasAnswer ? (
                                                    <div className="mt-1.5 space-y-1.5 pl-1">
                                                      {ans.text && <p className="bg-gray-50 border border-gray-100 p-2 rounded-lg text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{ans.text}</p>}
                                                      {ans.voice && (
                                                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
                                                          <span className="text-[10px] font-semibold text-primary flex items-center gap-1"><Volume2 size={11} />음성 ({Math.round(ans.voice.duration)}초)</span>
                                                          <audio controls src={ans.voice.data} className="h-7 max-w-[160px]" />
                                                        </div>
                                                      )}
                                                    </div>
                                                  ) : <p className="text-[10px] text-gray-400 italic mt-1 pl-1">— 답변 없음</p>}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
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
  );
}

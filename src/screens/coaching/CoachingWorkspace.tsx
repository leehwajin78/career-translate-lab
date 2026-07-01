'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDbMembers } from "@/hooks/useDbMembers";
import type { FinalProfile, AIDraft } from "@/store/coachingStore";
import { COACHING_QUESTIONS, COACHING_PARTS } from "@/data/coachingQuestions";
import { ArrowLeft, Save, Send, Volume2, Sparkles, RotateCcw, HelpCircle, Check, Award, FileText, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface WsAnswer { text: string; voice?: { data: string; duration: number } }
interface WsSession { status: string; answers: Record<number, WsAnswer> }

export default function CoachingWorkspace() {
  const { memberId } = useParams<{ memberId: string }>();
  const router = useRouter();
  const navigate = (p: string) => router.push(p);
  const { members } = useDbMembers();

  // DB에서 세션(실제 답변) + 리포트 초안 로드 (localStorage 스토어 대체)
  const [session, setSession] = useState<WsSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 대상 회원 찾기
  const targetMember = members.find((m) => m.id === memberId);

  // 상태 변수들
  const [selectedQId, setSelectedQId] = useState<number>(1);
  const [localNotes, setLocalNotes] = useState<Record<number, string>>({});
  const [mode, setMode] = useState<"diagnosis" | "build">(() => {
    const saved = memberId ? localStorage.getItem(`workspace-mode:${memberId}`) : null;
    return (saved as "diagnosis" | "build") || "diagnosis";
  });

  const handleModeChange = (newMode: "diagnosis" | "build") => {
    setMode(newMode);
    if (memberId) {
      localStorage.setItem(`workspace-mode:${memberId}`, newMode);
    }
    toast({
      title: `${newMode === "diagnosis" ? "진단 모드" : "빌드 모드"}로 전환`,
      description: newMode === "diagnosis" 
        ? "진단 단계에 필요한 원라이너와 강점만 활성화됩니다." 
        : "모든 브랜드 자산의 편집이 활성화됩니다.",
    });
  };
  
  // 브랜드 프로필 에디터 상태
  const [oneLiner, setOneLiner] = useState("");
  const [coreValue1, setCoreValue1] = useState("");
  const [coreValue2, setCoreValue2] = useState("");
  const [coreValue3, setCoreValue3] = useState("");
  const [strengthStatement, setStrengthStatement] = useState("");
  const [targetPersona, setTargetPersona] = useState("");
  const [brandStory, setBrandStory] = useState("");
  const [coreMessage, setCoreMessage] = useState("");
  const [channelStrategy, setChannelStrategy] = useState("");
  const [brandWhy, setBrandWhy] = useState("");
  const [coachComment, setCoachComment] = useState("");

  // 초안 대조용 상태 (각 항목별 원본 뷰 모드 토글)
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});

  // 세션(실제 답변) + 리포트 초안 로드
  useEffect(() => {
    if (!memberId) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/coaching/${memberId}`, { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;

        const s = data.session ?? { status: "in-progress", answers: {} };
        setSession({ status: s.status ?? "in-progress", answers: s.answers ?? {} });

        // 코치 메모(비공개 필기)는 로컬에 보관
        const savedNotes = localStorage.getItem(`workspace-notes:${memberId}`);
        if (savedNotes) {
          try { setLocalNotes(JSON.parse(savedNotes)); } catch { /* ignore */ }
        }

        // 리포트 초안(코치 이전 작성분)으로 에디터 채우기
        const bp = data.report?.brandProfile;
        if (bp) {
          setOneLiner(bp.oneLiner || "");
          setCoreValue1(bp.coreValues?.[0] || "");
          setCoreValue2(bp.coreValues?.[1] || "");
          setCoreValue3(bp.coreValues?.[2] || "");
          setStrengthStatement(bp.strengthStatement || "");
          setTargetPersona(bp.targetPersona || "");
          setBrandStory(bp.brandStory || "");
          setCoreMessage(bp.coreMessage || "");
          setChannelStrategy(bp.channelStrategy || "");
          setBrandWhy(bp.brandWhy || "");
          setCoachComment(bp.coachComment || "");
        }
      } catch {
        if (alive) toast({ title: "오류", description: "코칭 세션을 불러오지 못했습니다.", variant: "destructive" });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-400">
        코칭 세션 불러오는 중…
      </div>
    );
  }

  // AI 자동 초안은 Phase 2(WI-10) — MVP는 코치 수동 작성이므로 undefined
  const aiDraft: AIDraft | undefined = undefined;

  // 질문 매핑 데이터 도우미
  const currentQ = COACHING_QUESTIONS.find((q) => q.id === selectedQId);
  const currentAns = session.answers[selectedQId];
  const currentInsight = aiDraft?.questionInsights.find((qi) => qi.questionId === selectedQId);

  // 문항 메모(코치 비공개 필기) — 로컬 저장
  const handleNoteChange = (text: string) => {
    setLocalNotes((prev) => {
      const next = { ...prev, [selectedQId]: text };
      if (memberId) {
        try { localStorage.setItem(`workspace-notes:${memberId}`, JSON.stringify(next)); } catch { /* ignore */ }
      }
      return next;
    });
  };

  const buildProfile = (): FinalProfile => ({
    oneLiner,
    coreValues: [coreValue1.trim(), coreValue2.trim(), coreValue3.trim()].filter(Boolean),
    strengthStatement,
    targetPersona,
    brandStory,
    coreMessage,
    channelStrategy,
    brandWhy,
    coachComment,
  });

  // 브랜드 프로필을 서버에 저장(finalize=false 임시저장 / true 확정)
  async function postReport(finalize: boolean): Promise<boolean> {
    if (!memberId) return false;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/coaching/${memberId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandProfile: buildProfile(), finalize }),
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }

  // 프로필 임시 저장 (DB, 상태 변경 없음)
  const handleSaveDraft = async () => {
    const ok = await postReport(false);
    toast(
      ok
        ? { title: "임시 저장 완료", description: "작성 중인 브랜드 프로필이 서버에 저장되었습니다." }
        : { title: "저장 실패", description: "잠시 후 다시 시도해주세요.", variant: "destructive" },
    );
  };

  // 리포트 최종 승인 및 회원 공개 (DB status=finalized)
  const handleFinalize = async () => {
    if (!oneLiner.trim() || !strengthStatement.trim() || (mode === "build" && !coreValue1.trim())) {
      toast({
        title: "필수 정보 부족",
        description: mode === "build"
          ? "브랜드 원라이너, 강점 명제문, 핵심 가치는 최종 확정 시 반드시 작성되어야 합니다."
          : "진단 모드에서는 브랜드 원라이너와 강점 명제문이 작성되어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    const ok = await postReport(true);
    if (!ok) {
      toast({ title: "확정 실패", description: "잠시 후 다시 시도해주세요.", variant: "destructive" });
      return;
    }

    toast({
      title: "코칭 세션 최종 승인",
      description: `${targetMember?.name ?? "회원"}님의 브랜드 프로필이 최종 확정되어 대시보드에 리포트가 공개되었습니다.`,
    });
    navigate("/admin");
  };

  // 초안 복원 헬퍼
  const restoreToAi = (field: string) => {
    if (!aiDraft) return;
    const bp = aiDraft.brandProfile;
    
    if (confirm("이 항목의 텍스트를 원래 AI 분석 초안으로 원복하시겠습니까?")) {
      switch (field) {
        case "oneLiner": setOneLiner(bp.oneLiner); break;
        case "coreValues":
          setCoreValue1(bp.coreValues[0] || "");
          setCoreValue2(bp.coreValues[1] || "");
          setCoreValue3(bp.coreValues[2] || "");
          break;
        case "strengthStatement": setStrengthStatement(bp.strengthStatement); break;
        case "targetPersona": setTargetPersona(bp.targetPersona); break;
        case "brandStory": setBrandStory(bp.brandStory); break;
        case "coreMessage": setCoreMessage(bp.coreMessage); break;
        case "channelStrategy": setChannelStrategy(bp.channelStrategy); break;
        case "brandWhy": setBrandWhy(bp.brandWhy); break;
      }
      toast({
        title: "초안 복구 완료",
        description: "AI 분석 텍스트로 안전하게 롤백되었습니다.",
      });
    }
  };

  // 특정 문항으로 즉시 포커스 이동 기능 (프로필 빌더 근거 질문 연동)
  const jumpToQuestion = (qId: number) => {
    setSelectedQId(qId);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast({
      title: `Q${qId} 문항으로 이동`,
      description: "좌측 패널에서 관련 답변 및 코칭 스크립트를 바로 조회합니다.",
    });
  };

  const isFinalized = session.status === "finalized";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. 상단 바 */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft size={16} />
            관리자 콘솔
          </button>
          <span className="h-4 w-px bg-slate-200" />
          <h1 className="font-serif text-lg font-bold text-[#1E2D8C] flex items-center gap-2">
            <span>1:1 코칭 워크스페이스</span>
            <span className="text-xs font-sans font-bold bg-[#F0EFFB] text-[#1E2D8C] border border-[#1E2D8C]/15 px-2.5 py-0.5 rounded-full">
              {targetMember?.name ?? "회원"} 회원 세션
            </span>
          </h1>
          <span className="h-4 w-px bg-slate-200" />

          {/* Segmented Toggle [ 진단 모드 | 빌드 모드 ] */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/50 select-none">
            <button
              onClick={() => handleModeChange("diagnosis")}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === "diagnosis"
                  ? "bg-[#1E2D8C] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              진단 모드
            </button>
            <button
              onClick={() => handleModeChange("build")}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === "build"
                  ? "bg-[#1E2D8C] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              빌드 모드
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Save size={14} />
            임시 저장
          </button>
          <button
            onClick={handleFinalize}
            className="flex items-center gap-1.5 bg-[#C4A265] text-white hover:bg-[#C4A265]/90 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Send size={14} />
            {mode === "diagnosis"
              ? (isFinalized ? "진단 결과 수정 및 적용" : "진단 결과 확정 및 전달")
              : (isFinalized ? "최종 브랜드 프로필 수정 및 적용" : "최종 브랜드 프로필 확정 및 전달")}
          </button>
        </div>
      </header>

      {/* 2. 메인 좌우 레이아웃 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid gap-6 lg:grid-cols-2">
        
        {/* [좌측 컬럼] 코칭 정보 및 도구 패널 */}
        <section className="space-y-6 flex flex-col">
          
          {/* A. 42문항 미니 맵 네비게이터 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center justify-between">
              <span>🎯 42문항 자가진단 미니맵</span>
              <span className="font-mono text-[10px] text-slate-500">
                선택된 문항: Q{selectedQId}
              </span>
            </h3>
            <div className="grid grid-cols-10 gap-1.5">
              {COACHING_QUESTIONS.map((q) => {
                const ans = session.answers[q.id];
                const hasAnswer = ans && ((ans.text && ans.text.trim().length > 0) || ans.voice);
                const isSelected = selectedQId === q.id;

                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQId(q.id)}
                    className={`h-9 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center ${
                      isSelected
                        ? "bg-[#C4A265] text-white shadow-soft ring-2 ring-[#C4A265]/20 scale-105"
                        : hasAnswer
                        ? "bg-[#F0EFFB] text-[#1E2D8C] border border-[#1E2D8C]/15 hover:bg-[#F0EFFB]/80"
                        : "bg-slate-100 text-slate-300 hover:bg-slate-200"
                    }`}
                    title={`Q${q.id}. ${q.question}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. 현재 문항 상세 및 답변 조회 */}
          {currentQ && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft space-y-5 flex-1 flex flex-col">
              
              {/* 질문 정보 */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[#C4A265] tracking-widest uppercase bg-[#C4A265]/10 px-2.5 py-0.5 rounded-full">
                    PART {COACHING_QUESTIONS.findIndex(q => q.id === selectedQId) < 10 ? "1" : COACHING_QUESTIONS.findIndex(q => q.id === selectedQId) < 22 ? "2" : COACHING_QUESTIONS.findIndex(q => q.id === selectedQId) < 32 ? "3" : "4"}
                  </span>
                  <span className="text-[10px] font-bold text-[#1E2D8C] bg-[#F0EFFB] px-2.5 py-0.5 rounded-full">
                    🎯 브랜딩 요소: {currentQ.part.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-800 leading-snug">
                  <span className="text-[#1E2D8C] mr-2">Q{selectedQId}.</span>
                  {currentQ.question}
                </h2>
              </div>

              {/* 회원 답변 원문 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">💬 회원 답변 원문</h4>
                {currentAns ? (
                  <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4.5">
                    {currentAns.text ? (
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {currentAns.text}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">글쓰기 답변 없음</p>
                    )}

                    {currentAns.voice && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-semibold text-[#1E2D8C] flex items-center gap-1 shrink-0">
                          <Volume2 size={13} />
                          음성 답변 ({Math.round(currentAns.voice.duration)}초)
                        </span>
                        <audio
                          controls
                          src={currentAns.voice.data}
                          className="h-8 max-w-[220px]"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
                    회원이 아직 이 문항에 답변을 등록하지 않았습니다.
                  </div>
                )}
              </div>

              {/* AI 가이드 및 패턴 해석 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#C4A265]" />
                  AI 분석 & 1차 코칭 가이드
                </h4>
                {currentInsight ? (
                  <div className="border border-[#F0EFFB] bg-[#F0EFFB]/15 rounded-2xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-semibold text-slate-400 block mb-1">📊 매칭 패턴</span>
                        <span className="font-bold text-[#1E2D8C] bg-white border border-[#1E2D8C]/10 px-2.5 py-1 rounded-lg inline-block">
                          {currentInsight.matchedPattern}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400 block mb-1">🔗 프로필 연동</span>
                        <span className="font-medium text-slate-600">
                          {currentInsight.profileConnection}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs">
                      <span className="font-semibold text-slate-400 block mb-1">🟢 브랜딩 신호 해석</span>
                      <p className="bg-white p-3 rounded-xl border border-slate-100 text-slate-600 leading-relaxed">
                        {currentInsight.brandingSignal}
                      </p>
                    </div>

                    <div className="text-xs">
                      <span className="font-bold text-[#C4A265] block mb-1 flex items-center gap-1">
                        <Award size={13} />
                        💬 코치 추천 질문 스크립트 (직접 인용 가능)
                      </span>
                      <p className="bg-white p-3 rounded-xl border border-[#C4A265]/10 text-slate-800 font-medium leading-relaxed italic">
                        {currentInsight.coachingMessage}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 italic bg-[#F0EFFB]/5 border border-[#1E2D8C]/5 rounded-2xl">
                    분석 데이터(aiDraft)가 존재하지 않습니다. 자가진단을 제출한 회원인지 확인해 주세요.
                  </div>
                )}
              </div>

              {/* 코치 문항별 실시간 메모장 */}
              <div className="space-y-3 pt-2 mt-auto">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">✍️ 코치 실시간 필기 메모 (질문별 자동저장)</h4>
                <textarea
                  rows={3}
                  value={localNotes[selectedQId] || ""}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder="대화 중 회원의 핵심 답변 구조나 관찰한 브랜딩 신호를 자유롭게 필기하세요..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] focus:border-transparent transition-all placeholder:text-slate-300 leading-relaxed shadow-inner"
                />
              </div>

              {/* 이전 / 다음 질문 네비게이션 */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedQId((q) => Math.max(1, q - 1))}
                  disabled={selectedQId === 1}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-600 rounded-lg transition-colors"
                >
                  ◀ 이전 문항
                </button>
                <button
                  onClick={() => setSelectedQId((q) => Math.min(42, q + 1))}
                  disabled={selectedQId === 42}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-600 rounded-lg transition-colors"
                >
                  다음 문항 ▶
                </button>
              </div>

            </div>
          )}

        </section>

        {/* [우측 컬럼] 브랜드 프로필 빌더 패널 */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft space-y-6 overflow-y-auto max-h-[85vh]">
          
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-serif text-xl font-bold text-[#1E2D8C] flex items-center gap-1.5">
              <Award className="text-[#C4A265]" />
              브랜드 프로필 빌더 (최종 편집)
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed break-keep">
              {mode === "diagnosis"
                ? "진단 단계 — 원라이너와 강점만 확정합니다. 나머지는 빌드에서 펼쳐집니다."
                : "AI 초안을 디딤돌 삼아, 코치 인터뷰 대화를 반영한 최종 브랜드 결과물을 정교화합니다. 각 요소를 근거 질문과 매칭해 보완하세요."}
            </p>
          </div>

          <div className="space-y-6">
            
            {/* 1. 브랜드 원라이너 */}
            <div className="border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#1E2D8C] flex items-center gap-1">
                  <span>✦ 1. 브랜드 원라이너</span>
                  <button
                    onClick={() => jumpToQuestion(1)}
                    className="text-[10px] text-slate-400 hover:text-[#C4A265] font-normal hover:underline"
                    title="근거 질문 보기"
                  >
                    [📌 근거: Q1, Q21, Q41]
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowOriginal((prev) => ({ ...prev, oneLiner: !prev.oneLiner }))}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    {showOriginal.oneLiner ? "에디터 보기" : "🤖 초안대조"}
                  </button>
                  <button
                    onClick={() => restoreToAi("oneLiner")}
                    className="text-slate-400 hover:text-[#1E2D8C]"
                    title="초안으로 되돌리기"
                  >
                    <RotateCcw size={11} />
                  </button>
                </div>
              </div>

              {showOriginal.oneLiner && aiDraft ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed font-serif whitespace-pre-wrap">
                  {aiDraft.brandProfile.oneLiner}
                </div>
              ) : (
                <textarea
                  rows={2}
                  value={oneLiner}
                  onChange={(e) => setOneLiner(e.target.value)}
                  placeholder="예: 나는 전환기의 중장년 전문가가 자기 경험을 세상의 언어로 번역하도록 돕는 사람이다"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] font-serif leading-relaxed"
                />
              )}
            </div>

            {/* 2. 핵심 가치 3가지 */}
            <div className={`border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 space-y-3 transition-opacity ${
              mode === "diagnosis" ? "opacity-60" : ""
            }`}>
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#1E2D8C] flex items-center gap-1">
                  <span>✦ 2. 핵심 가치 3가지</span>
                  <button
                    onClick={() => jumpToQuestion(2)}
                    className="text-[10px] text-slate-400 hover:text-[#C4A265] font-normal hover:underline"
                  >
                    [📌 근거: Q2, Q6, Q20]
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  {mode === "diagnosis" ? (
                    <div className="flex items-center gap-1 bg-[#F1F5F9] text-slate-400 border border-slate-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold select-none">
                      <Lock size={10} />
                      <span>빌드 단계에서 작성됩니다</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowOriginal((prev) => ({ ...prev, coreValues: !prev.coreValues }))}
                        className="text-[10px] text-slate-500 hover:underline"
                      >
                        {showOriginal.coreValues ? "에디터 보기" : "🤖 초안대조"}
                      </button>
                      <button
                        onClick={() => restoreToAi("coreValues")}
                        className="text-slate-400 hover:text-[#1E2D8C]"
                        title="초안으로 되돌리기"
                      >
                        <RotateCcw size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showOriginal.coreValues && aiDraft ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed font-mono">
                  {aiDraft.brandProfile.coreValues.join(", ")}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={coreValue1}
                    onChange={(e) => setCoreValue1(e.target.value)}
                    placeholder="가치 1"
                    disabled={mode === "diagnosis"}
                    className="text-xs p-2.5 rounded-lg border border-slate-200 text-center disabled:bg-slate-100/50 disabled:text-slate-400"
                  />
                  <input
                    type="text"
                    value={coreValue2}
                    onChange={(e) => setCoreValue2(e.target.value)}
                    placeholder="가치 2"
                    disabled={mode === "diagnosis"}
                    className="text-xs p-2.5 rounded-lg border border-slate-200 text-center disabled:bg-slate-100/50 disabled:text-slate-400"
                  />
                  <input
                    type="text"
                    value={coreValue3}
                    onChange={(e) => setCoreValue3(e.target.value)}
                    placeholder="가치 3"
                    disabled={mode === "diagnosis"}
                    className="text-xs p-2.5 rounded-lg border border-slate-200 text-center disabled:bg-slate-100/50 disabled:text-slate-400"
                  />
                </div>
              )}
            </div>

            {/* 3. 강점 명제문 */}
            <div className="border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#1E2D8C] flex items-center gap-1">
                  <span>✦ 3. 강점 명제문</span>
                  <button
                    onClick={() => jumpToQuestion(11)}
                    className="text-[10px] text-slate-400 hover:text-[#C4A265] font-normal hover:underline"
                  >
                    [📌 근거: Q11, Q12, Q13]
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowOriginal((prev) => ({ ...prev, strengthStatement: !prev.strengthStatement }))}
                    className="text-[10px] text-slate-500 hover:underline"
                  >
                    {showOriginal.strengthStatement ? "에디터 보기" : "🤖 초안대조"}
                  </button>
                  <button
                    onClick={() => restoreToAi("strengthStatement")}
                    className="text-slate-400 hover:text-[#1E2D8C]"
                    title="초안으로 되돌리기"
                  >
                    <RotateCcw size={11} />
                  </button>
                </div>
              </div>

              {showOriginal.strengthStatement && aiDraft ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed whitespace-pre-wrap">
                  {aiDraft.brandProfile.strengthStatement}
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={strengthStatement}
                  onChange={(e) => setStrengthStatement(e.target.value)}
                  placeholder="차별화된 강점 역량을 전문적인 언어로 명문화해 주세요..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] leading-relaxed"
                />
              )}
            </div>

            {/* 4. 타깃 페르소나 */}
            <div className={`border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 space-y-3 transition-opacity ${
              mode === "diagnosis" ? "opacity-60" : ""
            }`}>
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#1E2D8C] flex items-center gap-1">
                  <span>✦ 4. 타깃 페르소나</span>
                  <button
                    onClick={() => jumpToQuestion(33)}
                    className="text-[10px] text-slate-400 hover:text-[#C4A265] font-normal hover:underline"
                  >
                    [📌 근거: Q9, Q26, Q33]
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  {mode === "diagnosis" ? (
                    <div className="flex items-center gap-1 bg-[#F1F5F9] text-slate-400 border border-slate-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold select-none">
                      <Lock size={10} />
                      <span>빌드 단계에서 작성됩니다</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowOriginal((prev) => ({ ...prev, targetPersona: !prev.targetPersona }))}
                        className="text-[10px] text-slate-500 hover:underline"
                      >
                        {showOriginal.targetPersona ? "에디터 보기" : "🤖 초안대조"}
                      </button>
                      <button
                        onClick={() => restoreToAi("targetPersona")}
                        className="text-slate-400 hover:text-[#1E2D8C]"
                        title="초안으로 되돌리기"
                      >
                        <RotateCcw size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showOriginal.targetPersona && aiDraft ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed whitespace-pre-wrap">
                  {aiDraft.brandProfile.targetPersona}
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={targetPersona}
                  onChange={(e) => setTargetPersona(e.target.value)}
                  disabled={mode === "diagnosis"}
                  placeholder="이상적인 브랜드 고객층을 심리적 결핍/인구통계적으로 묘사하세요..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] leading-relaxed disabled:bg-slate-100/50 disabled:text-slate-400"
                />
              )}
            </div>

            {/* 5. 브랜드 스토리 */}
            <div className={`border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 space-y-3 transition-opacity ${
              mode === "diagnosis" ? "opacity-60" : ""
            }`}>
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#1E2D8C] flex items-center gap-1">
                  <span>✦ 5. 브랜드 스토리</span>
                  <button
                    onClick={() => jumpToQuestion(8)}
                    className="text-[10px] text-slate-400 hover:text-[#C4A265] font-normal hover:underline"
                  >
                    [📌 근거: Q8, Q15, Q37]
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  {mode === "diagnosis" ? (
                    <div className="flex items-center gap-1 bg-[#F1F5F9] text-slate-400 border border-slate-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold select-none">
                      <Lock size={10} />
                      <span>빌드 단계에서 작성됩니다</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowOriginal((prev) => ({ ...prev, brandStory: !prev.brandStory }))}
                        className="text-[10px] text-slate-500 hover:underline"
                      >
                        {showOriginal.brandStory ? "에디터 보기" : "🤖 초안대조"}
                      </button>
                      <button
                        onClick={() => restoreToAi("brandStory")}
                        className="text-slate-400 hover:text-[#1E2D8C]"
                        title="초안으로 되돌리기"
                      >
                        <RotateCcw size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showOriginal.brandStory && aiDraft ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed whitespace-pre-wrap">
                  {aiDraft.brandProfile.brandStory}
                </div>
              ) : (
                <textarea
                  rows={3}
                  value={brandStory}
                  onChange={(e) => setBrandStory(e.target.value)}
                  disabled={mode === "diagnosis"}
                  placeholder="고객이 깊이 신뢰할 핵심적인 삶의 전환위복 에피소드를 요약하세요..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] leading-relaxed disabled:bg-slate-100/50 disabled:text-slate-400"
                />
              )}
            </div>

            {/* 6. 핵심 메시지 */}
            <div className={`border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 space-y-3 transition-opacity ${
              mode === "diagnosis" ? "opacity-60" : ""
            }`}>
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#1E2D8C] flex items-center gap-1">
                  <span>✦ 6. 핵심 메시지</span>
                  <button
                    onClick={() => jumpToQuestion(10)}
                    className="text-[10px] text-slate-400 hover:text-[#C4A265] font-normal hover:underline"
                  >
                    [📌 근거: Q10, Q38]
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  {mode === "diagnosis" ? (
                    <div className="flex items-center gap-1 bg-[#F1F5F9] text-slate-400 border border-slate-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold select-none">
                      <Lock size={10} />
                      <span>빌드 단계에서 작성됩니다</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowOriginal((prev) => ({ ...prev, coreMessage: !prev.coreMessage }))}
                        className="text-[10px] text-slate-500 hover:underline"
                      >
                        {showOriginal.coreMessage ? "에디터 보기" : "🤖 초안대조"}
                      </button>
                      <button
                        onClick={() => restoreToAi("coreMessage")}
                        className="text-slate-400 hover:text-[#1E2D8C]"
                        title="초안으로 되돌리기"
                      >
                        <RotateCcw size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showOriginal.coreMessage && aiDraft ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed font-serif whitespace-pre-wrap">
                  {aiDraft.brandProfile.coreMessage}
                </div>
              ) : (
                <textarea
                  rows={2}
                  value={coreMessage}
                  onChange={(e) => setCoreMessage(e.target.value)}
                  disabled={mode === "diagnosis"}
                  placeholder="세상에 울리는 단 한 마디의 시그니처 카피문..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] font-serif leading-relaxed disabled:bg-slate-100/50 disabled:text-slate-400"
                />
              )}
            </div>

            {/* 7. 채널 전략 */}
            <div className={`border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 space-y-3 transition-opacity ${
              mode === "diagnosis" ? "opacity-60" : ""
            }`}>
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#1E2D8C] flex items-center gap-1">
                  <span>✦ 7. 채널 전략</span>
                  <button
                    onClick={() => jumpToQuestion(40)}
                    className="text-[10px] text-slate-400 hover:text-[#C4A265] font-normal hover:underline"
                  >
                    [📌 근거: Q17, Q19, Q28, Q40]
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  {mode === "diagnosis" ? (
                    <div className="flex items-center gap-1 bg-[#F1F5F9] text-slate-400 border border-slate-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold select-none">
                      <Lock size={10} />
                      <span>빌드 단계에서 작성됩니다</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowOriginal((prev) => ({ ...prev, channelStrategy: !prev.channelStrategy }))}
                        className="text-[10px] text-slate-500 hover:underline"
                      >
                        {showOriginal.channelStrategy ? "에디터 보기" : "🤖 초안대조"}
                      </button>
                      <button
                        onClick={() => restoreToAi("channelStrategy")}
                        className="text-slate-400 hover:text-[#1E2D8C]"
                        title="초안으로 되돌리기"
                      >
                        <RotateCcw size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showOriginal.channelStrategy && aiDraft ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed whitespace-pre-wrap">
                  {aiDraft.brandProfile.channelStrategy}
                </div>
              ) : (
                <textarea
                  rows={2}
                  value={channelStrategy}
                  onChange={(e) => setChannelStrategy(e.target.value)}
                  disabled={mode === "diagnosis"}
                  placeholder="1순위 및 2순위 지식상품 전달 수단 및 표현 미디어를 설정하세요..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] leading-relaxed disabled:bg-slate-100/50 disabled:text-slate-400"
                />
              )}
            </div>

            {/* 8. 브랜드 WHY */}
            <div className={`border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 space-y-3 transition-opacity ${
              mode === "diagnosis" ? "opacity-60" : ""
            }`}>
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-[#1E2D8C] flex items-center gap-1">
                  <span>✦ 8. 브랜드 WHY</span>
                  <button
                    onClick={() => jumpToQuestion(42)}
                    className="text-[10px] text-slate-400 hover:text-[#C4A265] font-normal hover:underline"
                  >
                    [📌 근거: Q32, Q42]
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  {mode === "diagnosis" ? (
                    <div className="flex items-center gap-1 bg-[#F1F5F9] text-slate-400 border border-slate-200/60 px-2.5 py-0.5 rounded-full text-[10px] font-bold select-none">
                      <Lock size={10} />
                      <span>빌드 단계에서 작성됩니다</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowOriginal((prev) => ({ ...prev, brandWhy: !prev.brandWhy }))}
                        className="text-[10px] text-slate-500 hover:underline"
                      >
                        {showOriginal.brandWhy ? "에디터 보기" : "🤖 초안대조"}
                      </button>
                      <button
                        onClick={() => restoreToAi("brandWhy")}
                        className="text-slate-400 hover:text-[#1E2D8C]"
                        title="초안으로 되돌리기"
                      >
                        <RotateCcw size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {showOriginal.brandWhy && aiDraft ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed whitespace-pre-wrap">
                  {aiDraft.brandProfile.brandWhy}
                </div>
              ) : (
                <textarea
                  rows={2}
                  value={brandWhy}
                  onChange={(e) => setBrandWhy(e.target.value)}
                  disabled={mode === "diagnosis"}
                  placeholder="최종 평생현역 비즈니스를 관통할 궁극적 철학이자 임팩트 비전..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] leading-relaxed disabled:bg-slate-100/50 disabled:text-slate-400"
                />
              )}
            </div>

            {/* C. 코치 종합 코멘트 */}
            <div className="border border-amber-100 rounded-2xl p-5 bg-[#C4A265]/5 space-y-3">
              <label className="text-xs font-bold text-[#C4A265] flex items-center gap-1">
                <Award size={14} />
                <span>📝 코치 최종 피드백 코멘트 (회원 리포트 하단 노출)</span>
              </label>
              <textarea
                rows={4}
                value={coachComment}
                onChange={(e) => setCoachComment(e.target.value)}
                placeholder="코칭 인터뷰를 모두 마무리하며, 회원님이 브랜드로서 당당히 걸어갈 제2막을 온 마음으로 격려하고 코치의 진정성 담긴 조언을 남겨주세요..."
                className="w-full text-xs p-3 rounded-xl border border-[#C4A265]/20 bg-white focus:outline-none focus:ring-1 focus:ring-[#C4A265] leading-relaxed placeholder:text-slate-300"
              />
            </div>

          </div>

          {/* D. 하단 액션바 */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              최종 승인 시 상태가 완료로 갱신되며 회원의 대시보드에 프로필 뷰어가 배포됩니다.
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-1 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                임시 저장
              </button>
              <button
                onClick={handleFinalize}
                className="flex items-center gap-1 bg-[#1E2D8C] text-white hover:bg-[#1E2D8C]/90 px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <Check size={14} />
                {mode === "diagnosis"
                  ? (isFinalized ? "진단 결과 수정완료" : "진단 결과 확정 및 전송")
                  : (isFinalized ? "최종 프로필 수정완료" : "최종 브랜드 프로필 확정 및 전송")}
              </button>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

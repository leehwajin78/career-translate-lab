'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FREE_DIAGNOSTIC_QUESTIONS } from "@/data/content";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAD_STATUSES } from "@/store/leads";
import { useDbLeads } from "@/hooks/useDbLeads";

export default function AdminLeadDetail() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { leads, loading, updateStatus, updateMemo } = useDbLeads();
  const lead = leads.find((l) => l.id === id);

  useEffect(() => {
    if (!loading && !lead) router.replace("/admin");
  }, [loading, lead, router]);

  if (loading) return <div className="p-8 text-sm text-gray-400">불러오는 중…</div>;
  if (!lead) return null;

  const totalScore = lead.diagnosticScore ?? null;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <Link href="/admin" className="text-xs text-gray-400 hover:text-primary mb-2 inline-flex items-center gap-1">← 목록</Link>
          <h1 className="text-2xl font-bold text-[#0D1A3E]">리드 상세 — {lead.name}</h1>
          <p className="text-sm text-gray-500 mt-1">무료 7문항 진단 답변 정문 + 영역 점수 + 추천 패키지</p>
        </div>
        <div className="flex gap-2">
          <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v as any)}>
            <SelectTrigger className="h-8 w-[120px] text-xs bg-primary text-white border-primary font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* 진단 결과 요약 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-sm text-[#0D1A3E] mb-4">진단 결과 요약</h3>
          <div className="flex gap-4 items-center mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-primary flex flex-col items-center justify-center shrink-0 bg-blue-50">
              <span className="text-2xl font-bold text-primary">{totalScore ?? "—"}</span>
              <span className="text-[10px] text-gray-400">{lead.diagnosticType || ""}</span>
            </div>
            {lead.scores && (
              <div className="flex-1 space-y-1.5 text-xs">
                {[
                  { label: "정체성", val: lead.scores.identity },
                  { label: "강점", val: lead.scores.strengths },
                  { label: "타깃", val: lead.scores.target },
                  { label: "차별화", val: lead.scores.differentiation },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="w-12 text-gray-500 text-[10px]">{s.label}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.val}%` }} />
                    </div>
                    <span className="font-mono font-bold text-primary text-[10px] w-8">{s.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {lead.recommendedPackage && (
            <p className="text-xs text-gray-500">추천 패키지: <span className="font-bold text-primary">{lead.recommendedPackage}</span></p>
          )}
        </div>

        {/* 리드 정보 + 이운 메모 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-sm text-[#0D1A3E] mb-4">리드 정보 · 이운 메모</h3>
          <table className="w-full text-xs mb-4">
            <tbody className="divide-y divide-gray-100">
              <tr><th className="py-1.5 text-left text-gray-500 font-medium w-20">연락처</th><td className="py-1.5 font-mono">{lead.phone} · {lead.email}</td></tr>
              <tr><th className="py-1.5 text-left text-gray-500 font-medium">분야/경력</th><td className="py-1.5">{lead.field}</td></tr>
              <tr><th className="py-1.5 text-left text-gray-500 font-medium">관심 목적</th><td className="py-1.5">{lead.purposes?.join(", ") || "—"}</td></tr>
              <tr><th className="py-1.5 text-left text-gray-500 font-medium">원하는 결과물</th><td className="py-1.5">{lead.outcomes?.join(", ") || "—"}</td></tr>
              <tr><th className="py-1.5 text-left text-gray-500 font-medium">상담 방식</th><td className="py-1.5">{lead.channel || "—"}</td></tr>
            </tbody>
          </table>
          <Textarea
            rows={3}
            value={lead.memo}
            onChange={(e) => updateMemo(lead.id, e.target.value)}
            placeholder="이운 메모 — 입력 즉시 자동 저장"
            className="text-xs"
          />
          <p className="text-[10px] text-gray-400 mt-1">메모는 입력 즉시 자동 저장됩니다</p>
        </div>
      </div>

      {/* 7문항 답변 전문 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-sm text-[#0D1A3E] mb-4">7문항 답변 전문</h3>
        {lead.answers ? (
          <div className="space-y-4">
            {FREE_DIAGNOSTIC_QUESTIONS.map((q) => (
              <div key={q.id} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                <p className="font-semibold text-xs text-primary mb-1.5">Q{q.id}. {q.question}</p>
                <p className="text-xs text-gray-700 bg-gray-50 border border-gray-100 p-3 rounded-xl whitespace-pre-wrap leading-relaxed">
                  {lead.answers?.[q.id] || "답변 없음"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">이 리드는 진단 답변 데이터가 저장되어 있지 않습니다.</p>
        )}
      </div>
    </div>
  );
}

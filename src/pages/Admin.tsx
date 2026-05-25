import { useState } from "react";
import { LEAD_STATUSES, useLeadsStore } from "@/store/leads";
import { PACKAGES, FREE_DIAGNOSTIC_QUESTIONS } from "@/data/content";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// AdminGate placeholder — swap with real auth later
function AdminGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function Admin() {
  const { leads, updateStatus, updateMemo } = useLeadsStore();
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  return (
    <AdminGate>
        <div className="container-prose py-16">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="font-mono text-xs text-accent">ADMIN</p>
              <h1 className="font-serif mt-2 text-3xl md:text-4xl text-primary">상담 리드 관리</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                현재 저장된 상담 신청 및 진단 리드 목록입니다. (프로토타입 — 로컬 데이터)
              </p>
            </div>
            <p className="text-sm text-muted-foreground">총 <span className="text-foreground font-mono">{leads.length}</span>건</p>
          </div>

          <div className="mt-10 overflow-x-auto border border-border rounded-[var(--radius)] bg-card shadow-soft">
            {leads.length === 0 ? (
              <div className="p-16 text-center text-muted-foreground text-sm">
                아직 등록된 리드가 없습니다.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs tracking-widest text-muted-foreground">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">이름</th>
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
                  {leads.map((l) => (
                    <>
                      <tr key={l.id} className="border-t border-border align-top">
                        <td className="px-4 py-4">
                          <p className="font-medium text-primary">{l.name}</p>
                          <p className="text-xs text-muted-foreground">{l.field}</p>
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
                          <td colSpan={9} className="px-6 py-6 text-foreground">
                            <div className="grid gap-6 md:grid-cols-2">
                              {/* 1. 세부 영역 점수 및 상담 세부 정보 */}
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
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
    </AdminGate>
  );
}

import { LEAD_STATUSES, useLeadsStore } from "@/store/leads";
import { PACKAGES } from "@/data/content";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// AdminGate placeholder — swap with real auth later
function AdminGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function Admin() {
  const { leads, updateStatus, updateMemo } = useLeadsStore();

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
                    <th className="px-4 py-3 font-medium min-w-[260px]">메모</th>
                    <th className="px-4 py-3 font-medium">신청일</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
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
                        {l.recommendedPackage ? PACKAGES[l.recommendedPackage].title : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v as any)}>
                          <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
    </AdminGate>
  );
}

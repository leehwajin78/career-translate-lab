import { Link, useNavigate } from "react-router-dom";
import { useNotificationStore } from "@/store/notificationStore";

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

export default function AdminNotifications() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1A3E]">알림 시스템</h1>
          <p className="text-sm text-gray-500 mt-1">제출 차임벨 + 데스크탑 푸시 + 멀티탭 동기화</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllAsRead} className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg bg-white hover:bg-gray-50">전체 읽음</button>
          <button onClick={clearNotifications} className="px-3 py-1.5 text-xs font-bold border border-red-200 text-red-500 rounded-lg bg-white hover:bg-red-50">초기화</button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { v: unread, k: "읽지 않은 알림", warn: unread > 0 },
          { v: "Web Audio", k: "제출 차임벨 재생" },
          { v: "Notification API", k: "데스크탑 푸시" },
          { v: "BroadcastChannel", k: "멀티탭 동기화" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-center">
            <div className={`text-xl font-bold ${(kpi as any).warn ? "text-amber-600" : "text-[#0D1A3E]"}`}>{kpi.v}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{kpi.k}</div>
          </div>
        ))}
      </div>

      {/* 알림 목록 */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-bold text-sm text-[#0D1A3E]">알림 목록</h3>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr className="text-left">
              <th className="px-5 py-2.5"></th>
              <th className="px-5 py-2.5">내용</th>
              <th className="px-5 py-2.5">시간</th>
              <th className="px-5 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400 italic">최근 접수된 알림이 없습니다.</td></tr>
            ) : notifications.map((notif) => (
              <tr key={notif.id} className={`border-t border-gray-100 ${notif.isRead ? "opacity-60" : ""}`}>
                <td className="px-5 py-3 text-lg">{notif.isRead ? "✓" : "🔔"}</td>
                <td className="px-5 py-3">
                  <strong className="font-semibold text-gray-800">{notif.memberName}님이 42문항 답변을 제출했습니다</strong>
                  <span className="text-gray-500"> — 워크스페이스에서 검토를 시작하세요</span>
                </td>
                <td className="px-5 py-3 font-mono text-gray-400">{getRelativeTime(notif.timestamp)}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => { markAsRead(notif.id); navigate(`/coaching/workspace/${notif.memberId}`); }}
                    className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary/90"
                  >
                    검토
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 py-3 text-[10px] text-gray-400 border-t border-gray-100">
          제출 이벤트 발생 시: ① 차임벨 재생 → ② 데스크탑 푸시 발송 → ③ 열려 있는 모든 관리자 탭에 동기화
        </p>
      </div>
    </div>
  );
}

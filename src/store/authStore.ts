import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 간이 인증 스토어 (로컬 프로토타입) ─── */

export interface Member {
  id: string;
  name: string;
  email: string;
  password: string;
  productKey: string; // "diagnosis" | "build" etc
  createdAt: string;
}

interface AuthState {
  /** 현재 로그인된 멤버 */
  currentMember: Member | null;

  /** 관리자가 발급한 멤버 목록 */
  members: Member[];

  /** 로그인 시도 → 성공 시 Member 반환, 실패 시 null */
  login: (email: string, password: string) => Member | null;

  /** 로그아웃 */
  logout: () => void;

  /** 관리자: 멤버 발급 */
  addMember: (data: Omit<Member, "id" | "createdAt">) => Member;

  /** 관리자: 멤버 삭제 */
  removeMember: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentMember: null,
      members: [
        {
          id: "test-member-id",
          name: "테스터",
          email: "test@example.com",
          password: "password123",
          productKey: "diagnosis",
          createdAt: new Date().toISOString(),
        }
      ],

      login: (email, password) => {
        const member = get().members.find(
          (m) =>
            m.email.toLowerCase() === email.toLowerCase() &&
            m.password === password,
        );
        if (member) {
          set({ currentMember: member });
          return member;
        }
        return null;
      },

      logout: () => set({ currentMember: null }),

      addMember: (data) => {
        const member: Member = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ members: [member, ...s.members] }));
        return member;
      },

      removeMember: (id) =>
        set((s) => ({
          members: s.members.filter((m) => m.id !== id),
          // 삭제한 멤버가 현재 로그인 중이면 로그아웃
          currentMember:
            s.currentMember?.id === id ? null : s.currentMember,
        })),
    }),
    { name: "kkummolda-auth" },
  ),
);

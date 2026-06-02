import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CoachingNotification {
  id: string;
  memberId: string;
  memberName: string;
  status: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: CoachingNotification[];
  addNotificationLocally: (notification: CoachingNotification) => void;
  triggerNotification: (memberId: string, memberName: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// 1. Web Audio API Chime Synthesizer (C5 -> E5)
export const playChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // Play E5 (659.25 Hz) after 0.15s
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.65);
  } catch (e) {
    console.warn("Audio Context could not play chime:", e);
  }
};

// 2. HTML5 Notification Permission Requests & Push Triggers
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showDesktopNotification = (title: string, body: string, onClick?: () => void) => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    const notif = new Notification(title, {
      body,
      icon: "/favicon.ico",
    });
    if (onClick) {
      notif.onclick = (e) => {
        e.preventDefault();
        window.focus();
        onClick();
      };
    }
  }
};

// 3. BroadcastChannel Setup for Multi-tab Event Synchronization
const channelName = "kkummolda_admin_notif";
const channel = typeof window !== "undefined" ? new BroadcastChannel(channelName) : null;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotificationLocally: (notification) => {
        set((state) => {
          // Avoid duplicate notifications (e.g. if persisted store synced before BroadcastChannel)
          if (state.notifications.some((n) => n.id === notification.id)) {
            return state;
          }
          return {
            notifications: [notification, ...state.notifications],
          };
        });
      },

      triggerNotification: (memberId, memberName) => {
        const newNotif: CoachingNotification = {
          id: crypto.randomUUID(),
          memberId,
          memberName,
          status: "submitted",
          timestamp: new Date().toISOString(),
          isRead: false,
        };

        // 1. Save locally
        get().addNotificationLocally(newNotif);

        // 2. Broadcast to other tabs
        if (channel) {
          channel.postMessage({
            type: "NEW_SUBMISSION",
            notification: newNotif,
          });
        }

        // 3. Trigger native desktop push (if permission granted)
        showDesktopNotification(
          "나다운 브랜딩 알림",
          `${memberName}님이 42문항 답변 제출을 완료했습니다!`,
          () => {
            // Clicking notification directs to workspace
            window.location.href = `/coaching/workspace/${memberId}`;
          }
        );
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "kkummolda-notifications",
    }
  )
);

// Listen for broadcast events from other tabs
if (channel) {
  channel.onmessage = (event) => {
    const { type, notification } = event.data || {};
    if (type === "NEW_SUBMISSION" && notification) {
      useNotificationStore.getState().addNotificationLocally(notification);
      
      // Dispatch a CustomEvent for components (e.g. Admin.tsx) to play chimes and toasts
      const customEvent = new CustomEvent("kkummolda-new-submission", {
        detail: notification,
      });
      window.dispatchEvent(customEvent);
    }
  };
}

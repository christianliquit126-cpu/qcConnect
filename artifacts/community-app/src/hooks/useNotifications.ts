import { useState, useEffect } from "react";
import { ref, onValue, push, update, query, orderByChild, limitToLast } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  uid: string;
  type: "message" | "comment" | "help_update" | "like";
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  link?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const notifRef = query(
      ref(db, `notifications/${user.uid}`),
      orderByChild("createdAt"),
      limitToLast(30)
    );
    const unsub = onValue(notifRef, (snap) => {
      const data: Notification[] = [];
      snap.forEach((child) => {
        data.push({ id: child.key!, uid: user.uid, ...child.val() });
      });
      const sorted = data.reverse();
      setNotifications(sorted);
      setUnreadCount(sorted.filter((n) => !n.read).length);
    });
    return () => unsub();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    await update(ref(db, `notifications/${user.uid}/${id}`), { read: true });
  };

  const markAllAsRead = async () => {
    if (!user) return;
    for (const n of notifications.filter((n) => !n.read)) {
      await update(ref(db, `notifications/${user.uid}/${n.id}`), { read: true });
    }
  };

  const addNotification = async (
    uid: string,
    type: Notification["type"],
    title: string,
    body: string,
    link?: string
  ) => {
    await push(ref(db, `notifications/${uid}`), {
      type,
      title,
      body,
      read: false,
      createdAt: Date.now(),
      link: link || null,
    });
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, addNotification };
}

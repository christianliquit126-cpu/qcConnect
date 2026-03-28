import { useState, useEffect } from "react";
import {
  collection, query, onSnapshot, addDoc, updateDoc, doc,
  serverTimestamp, where, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface Notification {
  id: string;
  uid: string;
  type: "message" | "comment" | "help_update" | "like";
  title: string;
  body: string;
  read: boolean;
  createdAt: { seconds: number } | null;
  link?: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const notifs = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Notification[];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    });
    return unsub;
  }, [user]);

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  const markAllAsRead = async () => {
    for (const n of notifications.filter((n) => !n.read)) {
      await updateDoc(doc(db, "notifications", n.id), { read: true });
    }
  };

  const addNotification = async (uid: string, type: Notification["type"], title: string, body: string, link?: string) => {
    await addDoc(collection(db, "notifications"), {
      uid, type, title, body, read: false, createdAt: serverTimestamp(), link: link || null,
    });
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, addNotification };
}

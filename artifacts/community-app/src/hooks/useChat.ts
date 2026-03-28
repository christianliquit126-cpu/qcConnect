import { useState, useEffect } from "react";
import {
  ref, onValue, push, set, get, update, query,
  orderByChild, limitToLast,
} from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface ChatMessage {
  id: string;
  uid: string;
  content: string;
  timestamp: number;
}

export interface ChatUser {
  uid: string;
  name: string;
  avatar: string;
  location?: string;
}

export interface Chat {
  chatId: string;
  participants: Record<string, boolean>;
  lastMessage?: string;
  lastMessageTime?: number;
  otherUser?: ChatUser;
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const chatsRef = ref(db, "chats");
    const unsub = onValue(chatsRef, async (snap) => {
      const myChats: Chat[] = [];
      const promises: Promise<void>[] = [];

      snap.forEach((child) => {
        const data = child.val();
        if (data.participants && data.participants[user.uid]) {
          const otherUid = Object.keys(data.participants).find((uid) => uid !== user.uid);
          const chat: Chat = { chatId: child.key!, ...data };

          if (otherUid) {
            const p = get(ref(db, `users/${otherUid}`)).then((userSnap) => {
              if (userSnap.exists()) {
                chat.otherUser = { uid: otherUid, ...userSnap.val() };
              }
            });
            promises.push(p);
          }
          myChats.push(chat);
        }
      });

      await Promise.all(promises);
      myChats.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
      setChats([...myChats]);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const startChat = async (otherUid: string): Promise<string> => {
    if (!user) throw new Error("Not authenticated");
    const participants = [user.uid, otherUid].sort();
    const chatId = participants.join("_");
    const chatRef = ref(db, `chats/${chatId}`);
    const snap = await get(chatRef);
    if (!snap.exists()) {
      await set(chatRef, {
        participants: { [user.uid]: true, [otherUid]: true },
        lastMessage: "",
        lastMessageTime: Date.now(),
        createdAt: Date.now(),
      });
    }
    return chatId;
  };

  return { chats, loading, startChat };
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!chatId) return;
    const msgRef = query(ref(db, `chats/${chatId}/messages`), orderByChild("timestamp"), limitToLast(100));
    const unsub = onValue(msgRef, (snap) => {
      const data: ChatMessage[] = [];
      snap.forEach((child) => {
        data.push({ id: child.key!, ...child.val() });
      });
      setMessages(data);
    });
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !user) return;
    const typingRef = ref(db, `chats/${chatId}/typing`);
    const unsub = onValue(typingRef, (snap) => {
      if (!snap.exists()) { setTypingUser(null); return; }
      const typingData = snap.val() as Record<string, boolean>;
      const others = Object.entries(typingData)
        .filter(([uid, active]) => uid !== user.uid && active)
        .map(([uid]) => uid);
      setTypingUser(others.length > 0 ? others[0] : null);
    });
    return () => unsub();
  }, [chatId, user]);

  const sendMessage = async (content: string) => {
    if (!user || !chatId) return;
    const msgRef = ref(db, `chats/${chatId}/messages`);
    await push(msgRef, { uid: user.uid, content, timestamp: Date.now() });
    await update(ref(db, `chats/${chatId}`), {
      lastMessage: content,
      lastMessageTime: Date.now(),
    });
  };

  const setTypingIndicator = async (isTyping: boolean) => {
    if (!user || !chatId) return;
    await update(ref(db, `chats/${chatId}/typing`), { [user.uid]: isTyping });
  };

  return { messages, typingUser, sendMessage, setTypingIndicator };
}

export function useUsers() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsub = onValue(usersRef, (snap) => {
      const all: ChatUser[] = [];
      snap.forEach((child) => {
        if (child.key !== user?.uid) {
          all.push({ uid: child.key!, ...child.val() });
        }
      });
      setUsers(all);
    });
    return () => unsub();
  }, [user]);

  return { users };
}

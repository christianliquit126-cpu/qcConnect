import { useState, useEffect } from "react";
import {
  collection, query, onSnapshot, addDoc, serverTimestamp,
  orderBy, where, doc, setDoc, getDoc, getDocs, updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface ChatMessage {
  id: string;
  uid: string;
  content: string;
  timestamp: { seconds: number } | null;
}

export interface ChatUser {
  uid: string;
  name: string;
  avatar: string;
  online?: boolean;
  lastSeen?: { seconds: number } | null;
}

export interface Chat {
  chatId: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: { seconds: number } | null;
  otherUser?: ChatUser;
  unreadCount?: number;
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid));
    const unsub = onSnapshot(q, async (snap) => {
      const chatData: Chat[] = [];
      for (const d of snap.docs) {
        const data = d.data();
        const otherUid = data.participants.find((p: string) => p !== user.uid);
        let otherUser: ChatUser | undefined;
        if (otherUid) {
          const userSnap = await getDoc(doc(db, "users", otherUid));
          if (userSnap.exists()) {
            otherUser = { uid: otherUid, ...userSnap.data() } as ChatUser;
          }
        }
        chatData.push({ chatId: d.id, ...data, otherUser } as Chat);
      }
      chatData.sort((a, b) => {
        const at = a.lastMessageTime?.seconds || 0;
        const bt = b.lastMessageTime?.seconds || 0;
        return bt - at;
      });
      setChats(chatData);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const startChat = async (otherUid: string): Promise<string> => {
    if (!user) throw new Error("Not authenticated");
    const participants = [user.uid, otherUid].sort();
    const chatId = participants.join("_");
    const ref = doc(db, "chats", chatId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { participants, createdAt: serverTimestamp(), lastMessage: "", lastMessageTime: null });
    }
    return chatId;
  };

  return { chats, loading, startChat };
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ChatMessage[]);
    });
    return unsub;
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !user) return;
    const ref = doc(db, "chats", chatId);
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      if (data?.typing && data.typing !== user.uid) {
        setTyping(!!data.typingActive);
      } else {
        setTyping(false);
      }
    });
    return unsub;
  }, [chatId, user]);

  const sendMessage = async (content: string) => {
    if (!user || !chatId) return;
    const ref = collection(db, "chats", chatId, "messages");
    await addDoc(ref, { uid: user.uid, content, timestamp: serverTimestamp() });
    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: content,
      lastMessageTime: serverTimestamp(),
    });
  };

  const setTypingIndicator = async (isTyping: boolean) => {
    if (!user || !chatId) return;
    await updateDoc(doc(db, "chats", chatId), {
      typing: user.uid,
      typingActive: isTyping,
    });
  };

  return { messages, typing, sendMessage, setTypingIndicator };
}

export function useUsers() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      const allUsers = snap.docs.map((d) => ({ uid: d.id, ...d.data() })) as ChatUser[];
      setUsers(allUsers.filter((u) => u.uid !== user?.uid));
    });
    return unsub;
  }, [user]);

  return { users };
}

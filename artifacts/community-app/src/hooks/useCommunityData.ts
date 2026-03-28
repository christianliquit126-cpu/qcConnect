import { useState, useEffect } from "react";
import {
  collection, query, onSnapshot, orderBy, limit, where, getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface RecentUser {
  uid: string;
  name: string;
  avatar: string;
  location?: string;
  createdAt?: { seconds: number } | null;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface CommunityUpdate {
  id: string;
  type: "help_request" | "post";
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  location?: string;
  createdAt: { seconds: number } | null;
  authorName: string;
}

function timeAgo(seconds: number) {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getCategoryTag(category: string): { tag: string; tagColor: string } {
  const map: Record<string, { tag: string; tagColor: string }> = {
    "Food & Groceries": { tag: "FOOD", tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" },
    "Health & Medical": { tag: "HEALTH", tagColor: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
    "Transportation": { tag: "RIDE", tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
    "School & Supplies": { tag: "EDU", tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400" },
    "Flood Relief": { tag: "FLOOD", tagColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400" },
    "Shelter": { tag: "HOME", tagColor: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" },
    "Clothing": { tag: "CLOTH", tagColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400" },
    "Utilities": { tag: "UTIL", tagColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400" },
  };
  return map[category] || { tag: "NEED", tagColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };
}

export function useCommunityUpdates() {
  const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "helpRequests"),
      where("status", "==", "Pending"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items: CommunityUpdate[] = snap.docs.map((d) => {
        const data = d.data();
        const { tag, tagColor } = getCategoryTag(data.category);
        return {
          id: d.id,
          type: "help_request",
          tag,
          tagColor,
          title: data.title,
          desc: data.description,
          location: data.location || "",
          createdAt: data.createdAt,
          authorName: data.authorName,
        };
      });
      setUpdates(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { updates, loading };
}

export function useRecentUsers(count = 5) {
  const [users, setUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
      limit(count)
    );
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() })) as RecentUser[]);
      setLoading(false);
    });
    return unsub;
  }, [count]);

  return { users, loading };
}

export function useCategoryPostCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsub = onSnapshot(q, (snap) => {
      const map: Record<string, number> = {};
      snap.docs.forEach((d) => {
        const cat = d.data().category as string;
        if (cat) map[cat] = (map[cat] || 0) + 1;
      });
      setCounts(map);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { counts, loading };
}
